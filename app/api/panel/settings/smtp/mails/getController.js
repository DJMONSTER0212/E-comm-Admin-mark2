import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const mailsSettings = async ({ req }) => {
    // Database connection
    connectDB()
    // Fetching smtp details
    try {
        let settings = await settingModel.findOne().select({ 'mails': 1 }).lean();
        return Response.json(settings, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching mails settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}