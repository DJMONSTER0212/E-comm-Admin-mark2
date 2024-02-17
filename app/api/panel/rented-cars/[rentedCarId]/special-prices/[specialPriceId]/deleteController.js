import connectDB from '@/app/_conf/database/connection'
import { rentedCarSpecialpriceModel } from '@/app/_models/rented-car-special-price'

export const deleteSpecialPrice = async ({ req, params, session }) => {
    const { rentedCarId, specialPriceId } = params
    if (!rentedCarId, !specialPriceId) {
        return Response.json({ error: `Rented car id and special price id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check special price exist or not
    let tourDate;
    try {
        tourDate = await rentedCarSpecialpriceModel.findOne({ _id: specialPriceId });
        if (!tourDate) {
            return Response.json({ error: `Special price is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for special price existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting special price
    try {
        await rentedCarSpecialpriceModel.deleteOne({ _id: specialPriceId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting special price failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}