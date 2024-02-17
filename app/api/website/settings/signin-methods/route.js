import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'

export async function GET(req) {
    // Database connection
    connectDB()
    // Fetching sign in methods
    let settings;
    try {
        settings = await settingModel.findOne().select({ 'signinMethods': 1 }).lean();
        return Response.json(settings.signinMethods.filter((method) => method.isActive == true), { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching signin methods failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}