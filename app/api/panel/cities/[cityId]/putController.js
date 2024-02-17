import connectDB from '@/app/_conf/database/connection'
import { cityModel } from '@/app/_models/city'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations'

export const putCity = async ({ req, params, session }) => {
    const { cityId } = params
    if (!cityId) {
        return Response.json({ error: `City id is required to perform this action.` }, { status: 400 })
    }
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
    // Updating city
    try {
        await cityModel.updateOne({ _id: cityId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating city failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}