/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { env_config } from ".";
import { eAuthProvider, eUserRoles } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";

// credentials authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      let message = "User logged in successfully";
      try {
        const isUserExist = await User.findOne({ email }).select("+password");

        if (!isUserExist) {
          message = "User does not exist";
          return done(null, false, { message });
        }

        /* const isGoogleAuth = isUserExist.auth.some(
          ({ provider }) => provider === "google"
        );

        if (isGoogleAuth) {
          message =
            "Incorrect credentials, you logged in by google before. Try to log in by google or make password following instruction";
          return done(null, false, { message });
        }        */

        let isPasswordMatch = false;
        if (isUserExist?.password) {
          isPasswordMatch = await bcrypt.compare(
            password as string,
            isUserExist?.password as string
          );
        }

        if (!isPasswordMatch) {
          message = "Invalid credentials";
          return done(null, false, { message });
        }

        const userData = isUserExist.toObject();
        delete userData.password;

        done(null, userData, { message });
        //
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// google authentication
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
        console.log("❌ Google Strategy Error: ", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
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
