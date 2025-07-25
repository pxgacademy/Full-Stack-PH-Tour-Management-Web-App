/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import { User } from "../../app/modules/user/user.model";
import { googleStrategy } from "./strategies/google.strategy";
import { localStrategy } from "./strategies/local.strategy";

passport.use(localStrategy);
passport.use(googleStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
