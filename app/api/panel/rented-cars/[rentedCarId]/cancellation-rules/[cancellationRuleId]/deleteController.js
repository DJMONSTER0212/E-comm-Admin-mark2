import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const deleteCancellationRule = async ({ req, params, session }) => {
    const { cancellationRuleId, rentedCarId } = params
    if (!cancellationRuleId || !rentedCarId) {
        return Response.json({ error: `Rented car id and cancellation rule id are required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check rented car exist or not
    let rentedCar;
    try {
        rentedCar = await rentedCarModel.findOne({ _id: rentedCarId });
        if (!rentedCar) {
            return Response.json({ error: `Rented car is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for rented car existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting rented car cancellation rule
    try {
        await rentedCarModel.updateOne({ _id: rentedCarId, 'cancellationRules._id': cancellationRuleId, }, { $pull: { 'cancellationRules': { _id: cancellationRuleId } } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}