import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';
import urlSlug from 'url-slug'

export const postTour = async ({ req, params, session }) => {
    const body = await req.formData();
    const updateFields = {
        images: JSON.parse(body.get('images')) || [],
        name: body.get('name'),
        slug: urlSlug(body.get('name')),
        cityId: body.get('cityId'),
        tourCategoryId: body.get('tourCategoryId') || '',
    }
    // Check for city and category ID
    if (!updateFields.cityId || !updateFields.tourCategoryId) {
        return Response.json({ error: "City and tour category is required to perform this action." }, { status: 400 })
    }
    // Image files handling >>>>>>>>>>>>>>
    if (updateFields.images.length > 0) {
        try {
            const uploadPromises = updateFields.images.map(async (image, index) => {
                if (typeof image !== 'string') {
                    // Uploading file
                    try {
                        return await s3Upload(body.get(`images[${index}]`), 'tours');
                    } catch (error) {
                        throw new Error(error.message);
                    }
                } else {
                    return image;
                }
            });
            updateFields.images = await Promise.all(uploadPromises);
        } catch (error) {
            return Response.json({ error: `Uploading images failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
    }
    // Database connection
    connectDB()
    // Adding new tour
    try {
        const newTour = new tourModel(updateFields)
        await newTour.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding tour failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}