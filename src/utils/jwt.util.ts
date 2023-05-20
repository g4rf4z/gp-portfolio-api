import config from 'config';
import jwt from 'jsonwebtoken';

import type { Admin, AdminRole, Session } from '@prisma/client';

import { readSession } from '../services/session.service';

// Read the private and public keys of the configuration folder.
const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

// Define a TS type that describes the data assigned in the JWT tokens.
export type JwtTokenData = {
  account: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: AdminRole;
  };
  session: {
    id: string;
  };
};

// Define a TS type that combines session and admin information.
export type AdminSession = Session & { admin: Admin };

// Create a signed JWT token from the provided data and options using a private key.
export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

// Verify a JWT token using the provided token and a public key.
export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey) as JwtTokenData;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'token expired',
      decoded: null,
    };
  }
};

// Create a new access token if the provided refresh token is valid.
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken) as any;
  if (!decoded || !decoded['sessionId']) return false;

  // Define the parameters for finding the corresponding session.
  const findSessionParams = { id: decoded.sessionId, isActive: true };
  let foundSession: AdminSession;
  let account: Admin | undefined = undefined;

  try {
    // Try to find the session using the "findSessionParams".
    foundSession = (await readSession(findSessionParams, {
      include: { admin: true },
    })) as AdminSession;
    // Retrieve the associated admin account.
    account = foundSession.admin;
  } catch {
    return false;
  }
  // Return a new access token using the account and session information.
  return newAccessToken({
    account: account,
    session: { id: foundSession.id },
  });
};

// Create a new access token from "tokenData" parameter.
export const newAccessToken = (tokenData: JwtTokenData) => {
  return signJwt(tokenData, {
    expiresIn: config.get<string>('accessTokenTtl'),
  });
};

// Create a new refresh token from the "tokenData" parameter.
export const newRefreshToken = (tokenData: JwtTokenData) => {
  return signJwt(
    {
      accountId: tokenData.account.id,
      sessionId: tokenData.session.id,
    },
    { expiresIn: config.get<string>('refreshTokenTtl') }
  );
};
