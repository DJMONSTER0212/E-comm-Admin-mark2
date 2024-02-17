import connectDB from '@/app/_conf/database/connection'
import { carCompanyModel } from '@/app/_models/car-company';
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putCarCompany = async ({ req, params }) => {
    const { carCompanyId } = params
    const body = await req.formData();
    const updateFields = {
        name: body.get('name'),
        isPinOnFilters: body.get('isPinOnFilters') || false,
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'car-companies');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        if (body.get('image')) {
            updateFields.image = body.get('image')
        }
    }
    // Database connection
    connectDB()
    // Updating car company
    try {
        await carCompanyModel.updateOne({ _id: carCompanyId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating car company failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}