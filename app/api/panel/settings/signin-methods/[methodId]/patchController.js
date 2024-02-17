import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const patchSigninMethodSettings = async ({ req, params }) => {
    const { methodId } = params;
    const { isActive } = await req.json();
    // Database connection
    connectDB()
    // Toggling sign in method
    try {
        await settingModel.updateOne({ 'signinMethods._id': methodId }, { $set: { 'signinMethods.$.isActive': isActive, } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating sign in method failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}