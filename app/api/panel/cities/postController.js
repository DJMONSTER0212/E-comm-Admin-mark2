import connectDB from '@/app/_conf/database/connection'
import { cityModel } from '@/app/_models/city'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const postCity = async ({ req }) => {
    const body = await req.formData();
    const updateFields = {
        name: body.get('name'),
        stateId: body.get('stateId'),
        tags: JSON.parse(body.get('tags')),
        isActive: body.get('isActive') || false,
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'cities');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    }
    // Database connection
    connectDB()
    // Adding city
    try {
        const newCity = new cityModel(updateFields);
        await newCity.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding city failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }, { status: 400 })
    }
}