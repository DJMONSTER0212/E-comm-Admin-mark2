import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const patchS3DetailsSettings = async ({ req }) => {
    const { isActive } = await req.json();
    // Database connection
    connectDB()
    // Toggling smtp details
    try {
        await settingModel.updateOne({}, { $set: { 's3Details.isActive': isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating s3 details failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}