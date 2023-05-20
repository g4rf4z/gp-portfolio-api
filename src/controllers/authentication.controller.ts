import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';

import config from 'config';
import crypto from 'crypto';

import { CustomError, handleError } from '../utils/errors.util';
import { compareData, hashString } from '../utils/hash.util';
import type { JwtTokenData } from '../utils/jwt.util';
import { newAccessToken, newRefreshToken } from '../utils/jwt.util';
import { sendEmail } from '../utils/nodemailer.util';

import { readAdmin, updateAdmin } from '../services/admin.service';
import { createSession, updateSessions } from '../services/session.service';
import {
  createResetPasswordToken,
  findResetPasswordToken,
  updateResetPasswordToken,
  updateResetPasswordTokens,
} from '../services/resetPasswordToken.service';

import type {
  LoginInput,
  ResetPasswordInput,
  SetPasswordInput,
} from '../schemas/authentication.schema';

export const loginController = async (
  req: Request<{}, {}, LoginInput['body']>,
  res: Response
) => {
  try {
    // Initialize "foundOwner" variable.
    let foundOwner;

    // Create "customError" object to handle bad credentials.
    let badCredentials = new CustomError({
      type: 'customError',
      path: 'global',
      code: 401,
      message: 'invalid_credentials',
    });

    // Create "customError" object to handle disabled accounts.
    let disabledAccount = new CustomError({
      type: 'customError',
      path: 'global',
      code: 403,
      message: 'disabled_account',
    });

    // Check if account exists.
    try {
      const findOwnerParams = { email: req.body.data.email };
      foundOwner = await readAdmin(findOwnerParams);
    } catch (error) {
      throw badCredentials;
    }

    // Check if passwords match.
    const checkPassword = await compareData(
      foundOwner.password,
      req.body.data.password
    );

    if (!checkPassword) {
      throw badCredentials;
    }

    // Check if account is active.
    const checkIsActive = foundOwner.isActive;

    if (!checkIsActive) {
      throw disabledAccount;
    }

    // Create a new session.
    const createSessionData: Prisma.SessionCreateInput = {
      userAgent: req.get('user-agent') || null,
      admin: {
        connect: { id: foundOwner.id },
      },
    };

    const createdSessionOptions = {
      select: {
        id: true,
        createdAt: true,
        userAgent: true,
        admin: true,
      },
    };
    const createdSession = await createSession(
      createSessionData,
      createdSessionOptions
    );

    // Revoke active sessions.
    updateSessions(
      {
        ownerId: foundOwner.id,
        isActive: true,
        NOT: { id: createdSession.id },
      },
      { isActive: false }
    );

    // Generate tokens.
    const tokenData: JwtTokenData = {
      account: {
        id: foundOwner.id,
        firstname: foundOwner.firstname,
        lastname: foundOwner.lastname,
        email: foundOwner.email,
        role: foundOwner.role,
      },
      session: {
        id: createdSession.id,
      },
    };

    const accessToken = newAccessToken(tokenData);
    const refreshToken = newRefreshToken(tokenData);

    // Set cookies.
    res.cookie('accessToken', accessToken, {
      maxAge: 900000, // 15 minutes.
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 604800000, // 7 days.
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    // Send session data.
    delete (createdSession as any)?.admin?.password;
    return res.send(createdSession);
  } catch (error) {
    handleError(error, res);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    // Revoke all active sessions.
    res.locals = {};
    updateSessions(
      { ownerId: res.locals?.account?.id, isActive: true },
      { isActive: false }
    );

    // Send new token to overwrite the previous one.
    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.send({ message: 'Logout successful' });
  } catch (error) {
    handleError(error, res);
  }
};

// Import an environment variable that contains the client's URI.
const clientUrl = config.get<string>('clientUrl');

export const resetPasswordController = async (
  req: Request<{}, {}, ResetPasswordInput['body']>,
  res: Response
) => {
  let tokenSent = {
    message: 'Password reset email has been sent (if the account exists).',
  };

  try {
    let foundAccount;

    // Check if the account exists from the email entered.
    const foundAccountParams = { email: req.body.data.email };
    foundAccount = await readAdmin(foundAccountParams);

    // Invalidate previous reset password tokens.
    await updateResetPasswordTokens(
      { ownerId: foundAccount.id },
      { isValid: false }
    );

    // Generate reset password token and save it to the database.
    let token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await hashString(token);
    const createTokenData = {
      expiresAt: new Date(new Date().getTime() + 5 * 60000), // Expire after 5 minutes.
      token: tokenHash,
      ownerId: foundAccount.id,
    };

    // Create a password reset token with the provided data.
    await createResetPasswordToken(createTokenData);

    // Send a password reset email.
    await sendEmail({
      to: foundAccount.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Bonjour ${foundAccount.firstname},

      Veuillez cliquer sur le lien ci-dessous afin de réinitialiser votre mot de passe :
      <a href="${clientUrl}/set-password?id=${foundAccount.id}&token=${token}">Réinitialiser le mot de passe</a>`,
      html: `<p>Bonjour ${foundAccount.firstname},<br>
      <br>
      Veuillez cliquer sur le lien ci-dessous afin de réinitialiser votre mot de passe :<br>
      <a href="${clientUrl}/set-password?id=${foundAccount.id}&token=${token}">Réinitialiser le mot de passe</a></p>`,
    });
    return res.status(200).send(tokenSent);
  } catch (error) {
    if (error instanceof CustomError && error.message === 'not_found') {
      return res.status(200).send(tokenSent);
    }
    return handleError(error, res);
  }
};

export const setNewPasswordController = async (
  req: Request<SetPasswordInput['params'], {}, SetPasswordInput['body']>,
  res: Response
) => {
  try {
    let foundToken;
    try {
      foundToken = await findResetPasswordToken({
        ownerId: req.params.id,
        isValid: true,
        expiresAt: {
          gte: new Date(),
        },
      });
    } catch (error) {
      return res.status(498).send();
    }

    const tokenMatch = await compareData(foundToken.token, req.params.token);
    if (!tokenMatch) return res.status(498).send();

    // Invalidate token.
    await updateResetPasswordToken({ id: foundToken.id }, { isValid: false });

    // Hashe password.
    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;

    // Set new password.
    await updateAdmin(
      { id: req.params.id },
      { password: req.body.data.password }
    );
    return res.status(200).send({ message: 'Password updated successfully.' });
  } catch (error) {
    return handleError(error, res);
  }
};
