import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env_config } from "../../config";
import { AppError } from "../../errors/AppError";
import { eIsActive, iUserResponse } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import sCode from "../statusCode";

type Payload = Partial<iUserResponse> | JwtPayload;

const JWT_SECRET: string = env_config.JWT_SECRET;
const JWT_REFRESH_SECRET: string = env_config.JWT_REFRESH_SECRET;

const makeJwtPayload = ({ _id, email, role }: Payload) => {
  return { _id, email, role };
};

export const generateAccessToken = (data: Payload, period?: string): string => {
  const payload = makeJwtPayload(data);
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: period || env_config.JWT_TOKEN_PERIOD,
  } as SignOptions);
  if (!token)
    throw new AppError(
      sCode.UNAUTHORIZED,
      "Access token could not be generated"
    );
  return token;
};

export const generateRefreshToken = (data: Payload): string => {
  const payload = makeJwtPayload(data);
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: env_config.JWT_REFRESH_TOKEN_PERIOD,
  } as SignOptions);
  if (!token)
    throw new AppError(
      sCode.UNAUTHORIZED,
      "Refresh token could not be generated"
    );
  return token;
};

export const generateAllTokens = (data: Payload, period?: string) => {
  const payload = makeJwtPayload(data);
  const accessToken = generateAccessToken(payload, period);
  const refreshToken = generateRefreshToken(payload);
  if (!accessToken || !refreshToken)
    throw new AppError(
      sCode.UNAUTHORIZED,
      `${!accessToken ? "Access token" : "Refresh token"} could not be generated`
    );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JwtPayload => {
  const accessToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!accessToken)
    throw new AppError(sCode.UNAUTHORIZED, "Token is not valid");
  return accessToken;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const refreshToken = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  if (!refreshToken)
    throw new AppError(sCode.UNAUTHORIZED, "Token is not valid");
  return refreshToken;
};

export const generateAccessTokenByRefreshToken = async (
  refreshToken: string
) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded._id);
  if (!user) throw new AppError(sCode.NOT_FOUND, "User does not exist");

  if (user.isActive === eIsActive.BLOCKED || user.isDeleted)
    throw new AppError(
      sCode.BAD_REQUEST,
      `User is ${user.isDeleted ? "deleted" : "blocked"}`
    );

  const accessToken = generateAccessToken(user);
  return accessToken;
};
