import connectDB from '@/app/_conf/database/connection'
import { tourCategoryModel } from '@/app/_models/tour-category';
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putTourCategory = async ({ req, params }) => {
    const { tourCategoryId } = params
    const body = await req.formData();
    const updateFields = {
        name: body.get('name'),
        isPinOnNavbar: body.get('isPinOnNavbar') || false,
        isPinOnFilters: body.get('isPinOnFilters') || false,
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'tour-categories');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields.image = body.get('image')
    }
    // Database connection
    connectDB()
    // Updating tour category
    try {
        await tourCategoryModel.updateOne({ _id: tourCategoryId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating tour category failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}