import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner';
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putAuthBanner = async ({ req, params }) => {
    const { authBannerId } = params
    const body = await req.formData();
    const updateFields = {
        title: body.get('title'),
        shortDesc: body.get('shortDesc'),
        btnTitle: body.get('btnTitle'),
        link: body.get('link'),
        isActive: body.get('isActive') || false,
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'auth-banners');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields.image = body.get('image')
    }
    // Database connection
    connectDB()
    // Updating auth banner
    try {
        await authBannerModel.updateOne({ _id: authBannerId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating auth banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}