import connectDB from '@/app/_conf/database/connection'
import { carCompanyModel } from '@/app/_models/car-company';
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const postCarCompany = async ({ req, params }) => {
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
    }
    // Database connection
    connectDB()
    // Adding new car company
    try {
        const newCarCompany = new carCompanyModel(updateFields)
        await newCarCompany.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding car company failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}