import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting';

export const putSocial = async ({ req, params }) => {
    const body = await req.json();
    const updateFields = {
        'general.social': {
            facebook: body.facebook || '',
            instagram: body.instagram || '',
            x: body.x || '',
            peerlist: body.peerlist || '',
            linkedin: body.linkedin || '',
            youtube: body.youtube || '',
            google: body.google || '',
        }
    }
    // Database connection
    connectDB()
    // Updating settings
    try {
        console.log(updateFields)
        await settingModel.updateOne({}, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}