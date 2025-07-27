import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { eAuthMessages } from "../../../app/constants/messages/auth.messages";
import { eIsActive } from "../../../app/modules/user/user.interface";
import { User } from "../../../app/modules/user/user.model";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done) => {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return done(null, false, { message: eAuthMessages.USER_NOT_FOUND });
      }

      /*  const isGoogleAuth = isUserExist.auth.some(
          ({ provider }) => provider === "google"
        );

        if (isGoogleAuth) {
          message =
            "Incorrect credentials, you logged in by google before. Try to log in by google or make password following instruction";
          return done(null, false, { message });
        }        */

      const isMatch =
        user.password && (await bcrypt.compare(password, user.password));
      if (!isMatch) {
        return done(null, false, {
          message: eAuthMessages.INVALID_CREDENTIALS,
        });
      }

      if (user?.isDeleted)
        return done(null, false, { message: "User is deleted" });
      if (user?.isActive === eIsActive.BLOCKED)
        return done(null, false, { message: "User is blocked" });

      const userData = user.toObject();
      delete userData.password;

      done(null, userData, { message: eAuthMessages.LOGIN_SUCCESS });
    } catch (error) {
      done(error, false);
    }
  }
);
