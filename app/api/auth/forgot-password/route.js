import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'
import { userModel } from '@/app/_models/user'
import bcrypt from 'bcrypt'

export async function POST(req) {
    const { email, otp, password } = await req.json();
    if (!email || !otp || !password) {
        return Response.json({ error: "OTP, Email and Password are required to set password." }, { status: 400 })
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
        return Response.json({ error: `Fetching user details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    if (!user || !user.isVerified) {
        return Response.json({ error: "User with this email not found." }, { status: 400 })
    }
    if (user.remainingValidationAttempts == 0) {
        return Response.json({ error: "All attempts to verify using this OTP ended. Please request a new OTP." }, { status: 400 });
    }
    if (user.otpExpirationTime < new Date()) {
        return Response.json({ error: "OTP has been expired. Please resend a new one." }, { status: 400 });
    }
    if (user.otp != otp) {
        // Updating user details
        try {
            await userModel.updateOne({ email: email }, { $set: { remainingValidationAttempts: Number(user.remainingValidationAttempts) - 1 } });
            return Response.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
        } catch (error) {
            return Response.json({ error: `Updating remaining validation attempt failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
        }
    }
    // Updating user details
    try {
        await userModel.updateOne({ email: email }, { $set: { password: bcrypt.hashSync(password, 10), otp: null, otpExpirationTime: null, remainingValidationAttempts: null } }, { status: 400 });
        return Response.json({ status: 200 });
    } catch (error) {
        return Response.json({ error: `Setting up password failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
    }
}