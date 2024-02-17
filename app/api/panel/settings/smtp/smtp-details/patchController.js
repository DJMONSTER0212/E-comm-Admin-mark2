import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const patchSmtpDetailsSettings = async ({ req }) => {
    const { isActive } = await req.json();
    // Database connection
    connectDB()
    // Toggling smtp details
    try {
        await settingModel.updateOne({}, { $set: { 'smtpDetails.isActive': isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating smtp details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}