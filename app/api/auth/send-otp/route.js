import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'
import { userModel } from '@/app/_models/user'
import { otpSender } from "@/app/_conf/mail/mail-sender";

export async function POST(req) {
    const body = await req.json();
    if (!body.email) {
        return Response.json({ error: "Email is required to send OTP." }, { status: 400 })
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
    // Updating user details
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpirationTime = new Date();
        otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 30); // Expiration time for the otp
        try {
            await otpSender(otp, { name: user.name, email: user.email });
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
        await userModel.updateOne({ email: body.email }, { $set: { otp, otpExpirationTime, remainingValidationAttempts: 3 } });
        return Response.json({ status: 200 });
    } catch (error) {
        return Response.json({ error: `Sending OTP failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 });
    }
}