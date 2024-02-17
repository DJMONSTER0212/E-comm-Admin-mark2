import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'
import { userModel } from '@/app/_models/user'

export async function POST(req) {
    const body = await req.json();
    if (!body.email || !body.otp) {
        return Response.json({ error: "Email and OTP are required to verify an email." }, { status: 400 })
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
    // Fetching user details
    let user;
    try {
        user = await userModel.findOne({ email: body.email }).lean();
    } catch (error) {
        return Response.json({ error: `Fetching user details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    if (!user) {
        return Response.json({ error: "User with this email not found." }, { status: 400 })
    }
    if (user.remainingValidationAttempts == 0) {
        return Response.json({ error: "All attempts to verify using this OTP ended. Please request a new OTP." }, { status: 400 });
    }
    if (user.otpExpirationTime < new Date()) {
        return Response.json({ error: "OTP has been expired. Please resend a new one." }, { status: 400 });
    }
    if (user.otp != body.otp) {
        // Updating user details
        try {
            await userModel.updateOne({ email: body.email }, { $set: { remainingValidationAttempts: Number(user.remainingValidationAttempts) - 1 } });
            return Response.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
        } catch (error) {
            return Response.json({ error: `Updating remaining validation attempt failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
        }
    }
    // Updating user details
    try {
        await userModel.updateOne({ email: body.email }, { $set: { isVerified: true, otp: null, otpExpirationTime: null, remainingValidationAttempts: null } }, { status: 400 });
        return Response.json({ status: 200 });
    } catch (error) {
        return Response.json({ error: `Email verification failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
    }
}