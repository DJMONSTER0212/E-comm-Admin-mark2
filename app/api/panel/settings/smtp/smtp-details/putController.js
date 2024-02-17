import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const putSmtpDetailsSettings = async ({ req }) => {
    const smtpDetails = await req.json();
    // Database connection
    connectDB()
    // Updating smtp details
    try {
        await settingModel.updateOne({}, { $set: { 'smtpDetails': smtpDetails } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating SMTP details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}