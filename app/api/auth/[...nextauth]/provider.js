import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/app/_conf/database/connection";
import { userModel } from '@/app/_models/user'
import bcrypt from 'bcrypt';
import { otpSender } from "@/app/_conf/mail/mail-sender";

export const credentialsProvider = (settings, signinMethod) => CredentialsProvider({
    name: "credentials",
    credentials: {
        email: {
            label: "Email",
            type: "email",
            placeholder: "ex@example.com"
        },
        password: {
            label: "Password",
            type: "password",
            placeholder: "XXXXX"
        }
    },
    async authorize(credentials) {
        const { email, password } = credentials
        connectDB()
        // Fetch user details
        const user = await userModel.findOne({ email }).lean()
        if (!user) {
            throw new Error("No user found with this email. Please check and try again.")
        }
        if (user.isBlock) {
            throw new Error("Your account is blocked. Please contact support.")
        }
        if (!user.password) {
            switch (user.signedInWith) {
                case 'google':
                    throw new Error("Looks like you've signed in with Google before. Please use google to sign in.")
                default:
                    throw new Error("Looks like you've signed in with social accounts before. Please use social accounts options to sign in.")
            }
        } else if (!await bcrypt.compare(password, user.password)) {
            throw new Error("Password is incorrect. Please check and try again.")
        }
        if (!user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpirationTime = new Date();
            otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 30); // Expiration time for the otp
            try {
                await otpSender(otp, { name: user.name, email: user.email });
            } catch (error) {
                throw new Error(error.message)
            }
            try {
                await userModel.updateOne({ email: user.email }, { $set: { otp, otpExpirationTime, remainingValidationAttempts: 3 } });
            } catch (error) {
                throw new Error(`Setting OTP for user failed. Please try again.`)
            }
            throw new Error(`Please verify your email using OTP sent on your email`)
        }
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role
        }
    }
})

export const googleProvider = (settings, signinMethod) => GoogleProvider({
    clientId: signinMethod.credentials.clientId,
    clientSecret: signinMethod.credentials.clientSecret
})