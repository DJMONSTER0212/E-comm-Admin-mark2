import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const mailTemplatesSettings = async ({ req }) => {
    // Database connection
    connectDB()
    // Fetching mail templates
    try {
        let settings = await settingModel.findOne().select({ 'mailTemplates': 1 }).lean();
        return Response.json(settings, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching mail templates settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}