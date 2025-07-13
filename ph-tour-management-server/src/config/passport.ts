/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { env_config } from ".";
import { eAuthProvider, eUserRoles } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: env_config.GOOGLE_CLIENT_ID,
      clientSecret: env_config.GOOGLE_CLIENT_SECRET,
      callbackURL: env_config.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let message = "User already exist";
        const email = profile.emails?.[0].value;
        if (!email) {
          message = "Email not found";
          return done(null, false, { message });
        }

        let user = await User.findOne({ email });

        if (!user) {
          message = "User created successfully";

          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
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
        // eslint-disable-next-line no-console
        console.log("❌ Google Strategy Error: ", error);
        return done(error);
      }
    }
  )
);

type Done = (err: any, id?: unknown) => void;

passport.serializeUser((user: any, done: Done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
