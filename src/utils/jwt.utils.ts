import config from "config";
import jwt from "jsonwebtoken";

import type { Admin, AdminRole, Session } from "@prisma/client";

import { readSession } from "../services/session.service";

const privateKey = config.get<string>("privateKey").replace(/\\n/g, "\n");
const publicKey = config.get<string>("publicKey").replace(/\\n/g, "\n");

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

export type AdminSession = Session & { admin: Admin };

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

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
      expired: error.message === "token expired",
      decoded: null,
    };
  }
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken) as any;
  if (!decoded || !decoded["sessionId"]) return false;

  // Find corresponding session
  const findSessionParams = { id: decoded.sessionId, isActive: true };
  let foundSession: AdminSession;
  let account: Admin | undefined = undefined;

  try {
    foundSession = (await readSession(findSessionParams, {
      include: { admin: true },
    })) as AdminSession;
    account = foundSession.admin;
  } catch {
    return false;
  }

  // Create new access token
  return newAccessToken({
    account: account,
    session: { id: foundSession.id },
  });
};

export const newAccessToken = (tokenData: JwtTokenData) => {
  return signJwt(tokenData, {
    expiresIn: config.get<string>("refreshTokenTtl"),
  });
};

export const newRefreshToken = (tokenData: JwtTokenData) => {
  return signJwt(
    {
      accountId: tokenData.account.id,
      sessionId: tokenData.session.id,
    },
    { expiresIn: config.get<string>("refreshTokenTtl") }
  );
};
