import { Request, Response } from "express";

import { checkAdminClearance } from "../utils/checkPermissions.util";
import { compareData, hashString } from "../utils/hash.util";
import { handleError } from "../utils/errors.util";
import { sendEmail } from "../utils/nodemailer.util";

import {
  createAdmin,
  readAdmin,
  readAdmins,
  updateAdmin,
  deleteAdmin,
} from "../services/admin.service";

import type {
  CreateAdminInput,
  ReadAdminInput,
  ReadAdminsInput,
  UpdateCurrentAdminInput,
  UpdateCurrentAdminEmailInput,
  UpdateCurrentAdminPasswordInput,
  UpdateAdminRoleInput,
  DisableAdminInput,
  DeleteAdminInput,
} from "../schemas/admin.schema";

export const createAdminController = async (
  req: Request<{}, {}, CreateAdminInput["body"]>,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "ADMIN";
    }

    req.body.data.password = await hashString(req.body.data.password);
    delete req.body.data.passwordConfirmation;
    const createAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const createdAdmin = await createAdmin(req.body.data, createAdminOptions);
    return res.send(createdAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readAdminController = async (
  req: Request<ReadAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    const readAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmin = await readAdmin(req.params, readAdminOptions);
    return res.send(foundAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const readAdminsController = async (
  req: Request<{}, {}, ReadAdminsInput["body"]>,
  res: Response
) => {
  try {
    const readAdminsOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const foundAdmins = await readAdmins(req.body.params, readAdminsOptions);
    if (foundAdmins.length === 0) return res.status(204).send();
    return res.send(foundAdmins);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminController = async (
  req: Request<{}, {}, UpdateCurrentAdminInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        firstname: true,
        lastname: true,
        nickname: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      req.body.data,
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminEmailController = async (
  req: Request<{}, {}, UpdateCurrentAdminEmailInput["body"]>,
  res: Response
) => {
  try {
    const updateAdminOptions = {
      select: {
        firstname: true,
        email: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      req.body.data,
      updateAdminOptions
    );
    if (updatedAdmin.email !== res.locals.account.email) {
      await sendEmail({
        to: res.locals.account.email && updatedAdmin.email,
        subject: "Modification de votre adresse email",
        text: `Bonjour ${updatedAdmin.firstname},

        Nous vous informons que votre adresse e-mail a été mise à jour avec succès.
        Veuillez noter que votre nouvelle adresse e-mail ${updatedAdmin.email} est désormais utilisée comme identifiant de connexion.
        Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement en utilisant notre formulaire de contact.
        Merci de votre compréhension.

        Cordialement.`,
        html: `<p>Bonjour ${updatedAdmin.firstname},<br>
        <br>
        Nous vous informons que votre adresse e-mail a été mise à jour avec succès.<br>
        Veuillez noter que votre nouvelle adresse e-mail ${updatedAdmin.email} est désormais utilisée comme identifiant de connexion.<br>
        Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement en utilisant notre formulaire de contact.<br>
        Merci de votre compréhension.<br>
        <br>
        Cordialement.</p>`,
      });
    }
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateCurrentAdminPasswordController = async (
  req: Request<{}, {}, UpdateCurrentAdminPasswordInput["body"]>,
  res: Response
) => {
  try {
    const findOwner = { id: res.locals.account.id };
    const foundOwner = await readAdmin(findOwner);
    const passwordsMatch = await compareData(
      foundOwner.password,
      req.body.data.password
    );

    if (!passwordsMatch) {
      return res.status(400).send({
        message: "An error has occurred",
      });
    }
    const updateAdminOptions = {
      select: {
        firstname: true,
        password: true,
      },
    };
    const hashedNewPassword = await hashString(req.body.data.newPassword);
    delete req.body.data.newPasswordConfirmation;
    const updatedAdmin = await updateAdmin(
      { id: res.locals.account.id },
      { password: hashedNewPassword },
      updateAdminOptions
    );
    await sendEmail({
      to: res.locals.account.email,
      subject: "Modification de votre mot de passe",
      text: `Bonjour ${updatedAdmin.firstname},

        Nous vous informons que votre mot de passe a été modifié avec succès.
        Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement en utilisant notre formulaire de contact.

        À bientôt.`,
      html: `<p>Bonjour ${updatedAdmin.firstname},<br>
        <br>
        Nous vous informons que votre mot de passe a été modifié avec succès.<br>
        Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement en utilisant notre formulaire de contact.<br>
        <br>
        À bientôt.</p>`,
    });
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateAdminRoleController = async (
  req: Request<
    UpdateAdminRoleInput["params"],
    {},
    UpdateAdminRoleInput["body"]
  >,
  res: Response
) => {
  if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

  try {
    if (
      res.locals?.account?.role === "ADMIN" &&
      ["SUPERADMIN", "ADMIN"].includes(req.body.data.role || "")
    ) {
      req.body.data.role = "ADMIN";
    }

    const updateAdminOptions = {
      select: {
        role: true,
      },
    };
    const updatedAdmin = await updateAdmin(
      { id: req.params.id },
      req.body.data,
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const disableAdminController = async (
  req: Request<DisableAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

    const updateAdminOptions = {
      select: {
        isActive: true,
      },
    };

    const updatedAdmin = await updateAdmin(
      { id: req.params.id },
      { isActive: false },
      updateAdminOptions
    );
    return res.send(updatedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteAdminController = async (
  req: Request<DeleteAdminInput["params"], {}, {}>,
  res: Response
) => {
  try {
    if (!checkAdminClearance(res, ["SUPERADMIN"])) return;

    const deleteAdminOptions = {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstname: true,
        lastname: true,
        nickname: true,
        email: true,
        role: true,
        isActive: true,
      },
    };
    const deletedAdmin = await deleteAdmin(
      { id: req.params.id },
      deleteAdminOptions
    );
    return res.send(deletedAdmin);
  } catch (error) {
    return handleError(error, res);
  }
};
