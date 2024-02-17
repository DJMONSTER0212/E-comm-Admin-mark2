import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const postSigninMethodsSettings = async ({ req }) => {
    const method = await req.json();
    // Database connection
    connectDB()
    // Adding sign in method
    try {
        await settingModel.updateOne({}, { $push: { 'signinMethods': method } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Setting ${method.name} OAuth failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}