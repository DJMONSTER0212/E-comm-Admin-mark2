import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';
import urlSlug from 'url-slug'

export const postRentedCar = async ({ req, params, session }) => {
    const body = await req.formData();
    const updateFields = {
        images: JSON.parse(body.get('images')) || [],
        name: body.get('name'),
        nickname: body.get('nickname'),
        slug: urlSlug(body.get('name')),
        price: body.get('price'),
        cityId: body.get('cityId'),
        carCompanyId: body.get('carCompanyId') || '',
        carCategory: body.get('carCategory'),
    }
    // Check for city and car company ID
    if (!updateFields.cityId || !updateFields.carCompanyId) {
        return Response.json({ error: "City and car company is required to perform this action." }, { status: 400 })
    }
    // Image files handling >>>>>>>>>>>>>>
    if (updateFields.images.length > 0) {
        try {
            const uploadPromises = updateFields.images.map(async (image, index) => {
                if (typeof image !== 'string') {
                    // Uploading file
                    try {
                        return await s3Upload(body.get(`images[${index}]`), 'rented-cars');
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
    // Adding new rented car
    try {
        const newRentedCar = new rentedCarModel(updateFields)
        await newRentedCar.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}