import { compare } from "bcryptjs";
import { AppError } from "../../../errors/AppError";
import sCode from "../../statusCode";
import { generateToken } from "../../utils/jwt";
import { iUser } from "../user/user.interface";
import { User } from "../user/user.model";

//
export const credentialLoginService = async (payload: Partial<iUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email }).select("+password");

  if (!isUserExist) throw new AppError(sCode.NOT_FOUND, "User not found!");

  const isPasswordRight = await compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordRight)
    throw new AppError(sCode.UNAUTHORIZED, "Incorrect credentials");

  const token = generateToken(
    { userId: isUserExist._id, email, role: isUserExist.role },
    "1d"
  );

  const userData = isUserExist.toObject();
  delete userData.password;
  return { data: { ...userData, token } };
};
