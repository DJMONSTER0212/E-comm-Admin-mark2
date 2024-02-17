import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const putRentedCar = async ({ req, params, session }) => {
    const { rentedCarId } = params
    const body = await req.formData();
    const updateFields = {
        shortDesc: body.get('shortDesc'),
        desc: body.get('desc'),
        price: body.get('price'),
        tags: JSON.parse(body.get('tags')),
        cityId: body.get('cityId'),
        isActive: body.get('isActive') || false
    }
    // Check for city ID
    if (!updateFields.cityId) {
        return Response.json({ error: "City is required to perform this action." }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Updating rented car
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating rented car failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}