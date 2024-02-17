import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'
import { userModel } from '@/app/_models/user'
import { otpSender } from "@/app/_conf/mail/mail-sender";
import bcrypt from 'bcrypt'

export async function POST(req) {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
        return Response.json({ error: "Name, Email and Password are required for sign up." }, { status: 400 })
    }
    // Database connection and fetching settings
    connectDB()
    let settings;
    try {
        settings = await settingModel.findOne().lean();
    } catch (error) {
        return Response.json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    if (!settings.sadmin.activateWebsite) {
        return Response.json({ error: "Website is disabled. Please contact super admin to reactivate website." }, { status: 400 })
    }
    // To check user exist or not [If exist and not verified delete the user]
    let user;
    try {
        user = await userModel.findOne({ email }).lean();
    } catch (error) {
        return Response.json({ error: `Fetching existing user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    if (user && user.verified) {
        res.status(400).json({ error: "An user with this email already exists. Please try to sign in." });
        return;
    }
    if (user && !user.verified) {
        try {
            await userModel.deleteOne({ email })
        } catch (error) {
            return Response.json({ error: `Deleting existing unverified user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
    }
    // Creating new user
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpirationTime = new Date();
        otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 30); // Expiration time for the otp
        try {
            await otpSender(otp, { name, email });
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
        const newUser = new userModel({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            image: '/panel/images/newUser.webp',
            verified: false,
            role: 'user',
            otp,
            otpExpirationTime,
            remainingValidationAttempts: 3,
            signedInWith: 'credentials'
        })
        await newUser.save();
        return Response.json({ status: 200 });
    } catch (error) {
        return Response.json({ error: `Creating user account failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
    }
}