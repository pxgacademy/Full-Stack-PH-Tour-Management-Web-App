import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { env_config } from "../..";
import {
  eAuthProvider,
  eUserRoles,
} from "../../../app/modules/user/user.interface";
import { User } from "../../../app/modules/user/user.model";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: env_config.GOOGLE_CLIENT_ID,
    clientSecret: env_config.GOOGLE_CLIENT_SECRET,
    callbackURL: env_config.GOOGLE_CALLBACK_URL,
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      let message = "User already exist";
      const email = profile.emails?.[0].value;

      if (!email) return done(null, false, { message: "Email not found" });

      let user = await User.findOne({ email });
      if (!user) {
        message = "User created successfully";

        const fullName = profile.displayName || "";

        const [firstName, ...rest] = fullName.trim().split(" ");
        const lastName = rest.join(" ");

        user = await User.create({
          email,
          name: { firstName, lastName },
          picture: profile.photos?.[0].value || "",
          role: eUserRoles.USER,
          isVerified: true,
          auth: [
            {
              provider: eAuthProvider.google,
              providerId: email,
            },
          ],
        });
      }

      done(null, user, { message });
    } catch (error) {
      return done(error);
    }
  }
);
