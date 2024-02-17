import NextAuth from "next-auth";
import { credentialsProvider, googleProvider } from "./provider";
import connectDB from "@/app/_conf/database/connection";
import { settingModel } from "@/app/_models/setting";
import { userModel } from '@/app/_models/user';

const getProviders = async () => {
    connectDB()
    const settings = await settingModel.findOne().lean();
    const activeSigninMethods = settings.signinMethods.filter(method => method.isActive);
    const providers = activeSigninMethods.map(signinMethod => {
        switch (signinMethod.name) {
            case 'credentials':
                return credentialsProvider(settings, signinMethod);
            case 'google':
                return googleProvider(settings, signinMethod);
            default:
                return null;
        }
    }).filter(provider => provider !== null);
    return providers;
};

const handleCredentialsSignIn = async (user, settings) => {
    if (user.role !== 'sadmin' && !settings.sadmin.activateWebsite) {
        throw new Error("Website is disabled. Please contact super admin to reactivate website.");
    }
    return true;
};

const handleGoogleSignIn = async (user, settings) => {
    try {
        const existingUser = await userModel.findOne({ email: user.email }).lean();
        if (!existingUser) {
            if (!settings.sadmin.activateWebsite) {
                return '/auth/signin?signInMethod=google&error=Website is disabled. Please contact super admin to reactivate website.'
            }
            const newUser = new userModel({
                name: user.name,
                email: user.email,
                verified: true,
                role: 'user',
                signedInWith: 'google'
            });
            await newUser.save();
            user._id = newUser._id.toString();
            user.name = newUser.name
            user.image = newUser.image
            user.role = newUser.role;
            return user;
        } else {
            if (existingUser.role !== 'sadmin' && !settings.sadmin.activateWebsite) {
                return '/auth/signin?signInMethod=google&error=Website is disabled. Please contact super admin to reactivate website.'
            }
            if (existingUser.isBlock) {
                return '/auth/signin?signInMethod=google&error=Your account is blocked. Please contact support.'
            }
            if (!existingUser.isVerified) {
                try {
                    await userModel.updateOne({ email: user.email }, { $set: { verified: true } })
                } catch (error) {
                    return `/auth/signin?signInMethod=google&error=Verifying your account failed. Please contact support. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}`
                }
            }
            // Return user info if exist
            user._id = existingUser._id.toString();
            user.name = existingUser.name
            user.image = existingUser.image
            user.role = existingUser.role;
            return true;
        }
    } catch (error) {
        return `/auth/signin?signInMethod=google&error=Finding or creating user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}`
    }
};

export const authOptions = {
    session: {
        jwt: true,
    },
    providers: await getProviders(),
    callbacks: {
        async signIn({ user, account }) {
            connectDB();
            const settings = await settingModel.findOne().lean();
            switch (account.provider) {
                case 'credentials':
                    return handleCredentialsSignIn(user, settings);
                case 'google':
                    return handleGoogleSignIn(user, settings);
                default:
                    break;
            }
        },
        async jwt({ token, user, trigger, session }) {
            if (token && user) {
                token._id = user._id;
                token.image = user.image;
                token.role = user.role;
            }
            if (trigger === "update" && session) {
                const allowedProperties = ["name", "email", "image", "role"];
                if (token?._id) {
                    const userDetailsOnServer = await userModel.findOne({ _id: token?._id }).select({ name: 1, email: 1, image: 1, role: 1 }).lean();
                    Object.keys(session).forEach(key => {
                        if (
                            allowedProperties.includes(key) &&
                            typeof session[key] === 'string' &&
                            userDetailsOnServer[key] === session[key]
                        ) {
                            token[key] = session[key];
                        }
                    });
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session && token) {
                session.user._id = token._id;
                session.user.image = token.image;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
