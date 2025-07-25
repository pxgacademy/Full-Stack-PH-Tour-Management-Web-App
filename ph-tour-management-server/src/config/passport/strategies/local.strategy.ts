import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { eIsActive } from "../../../app/modules/user/user.interface";
import { User } from "../../../app/modules/user/user.model";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done) => {
    const message = "User logged in successfully";

    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return done(null, false, { message: "User does not exist" });
      }

      const isMatch =
        user.password && (await bcrypt.compare(password, user.password));
      if (!isMatch) {
        return done(null, false, { message: "Invalid credentials" });
      }

      if (user?.isDeleted)
        return done(null, false, { message: "User is deleted" });
      if (!user?.isVerified)
        return done(null, false, { message: "User is not verified" });
      if (user?.isActive === eIsActive.BLOCKED)
        return done(null, false, { message: "User is blocked" });

      const userData = user.toObject();
      delete userData.password;

      done(null, userData, { message });
    } catch (error) {
      done(error);
    }
  }
);
