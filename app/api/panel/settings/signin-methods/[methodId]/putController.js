import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const putSigninMethodSettings = async ({ req, params }) => {
    const { methodId } = params;
    const method = await req.json();
    // Database connection
    connectDB()
    // Updating sign in method
    try {
        await settingModel.updateOne({ 'signinMethods._id': methodId }, { $set: { 'signinMethods.$': method } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating ${method.name} OAuth failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}