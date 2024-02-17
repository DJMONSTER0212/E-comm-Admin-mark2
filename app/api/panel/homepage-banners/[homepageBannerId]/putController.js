import connectDB from '@/app/_conf/database/connection'
import { homepageBannerModel } from '@/app/_models/homepage-banner';
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putHomepageBanner = async ({ req, params }) => {
    const { homepageBannerId } = params
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
            updateFields.image = await s3Upload(body.get('image'), 'homepage-banners');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields.image = body.get('image')
    }
    // Database connection
    connectDB()
    // Updating homepage banner
    try {
        await homepageBannerModel.updateOne({ _id: homepageBannerId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating homepage banner failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}