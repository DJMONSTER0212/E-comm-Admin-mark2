import connectDB from '@/app/_conf/database/connection'
import { rentedCarSpecialpriceModel } from '@/app/_models/rented-car-special-price'

export const specialPrice = async ({ req, params, session }) => {
    const { rentedCarId, specialPriceId } = params
    if (!rentedCarId, !specialPriceId) {
        return Response.json({ error: `Rented car id and special price id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching special price
    try {
        let specialPrice = await rentedCarSpecialpriceModel.findOne({ _id: specialPriceId, rentedCarId });
        return Response.json(specialPrice, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching special price failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
