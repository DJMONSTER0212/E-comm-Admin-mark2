import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const policiesSettings = async ({ req }) => {
    // Database connection
    connectDB()
    // Fetching settings
    try {
        let settings = await settingModel.findOne().select({ 'policies': 1 }).lean();
        return Response.json(settings, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
