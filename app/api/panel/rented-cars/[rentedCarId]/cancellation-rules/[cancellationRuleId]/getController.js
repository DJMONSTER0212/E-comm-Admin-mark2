import connectDB from '@/app/_conf/database/connection'
import { rentedCarModel } from '@/app/_models/rented-car'

export const cancellationRule = async ({ req, params, session }) => {
    const { cancellationRuleId, rentedCarId } = params
    if (!cancellationRuleId || !rentedCarId) {
        return Response.json({ error: `Rented car id and cancellation rule id are required to fetch cancellation rule.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching rented car to get cancellation rule
    try {
        let rentedCar = await rentedCarModel.findOne({ _id: rentedCarId, 'cancellationRules._id': cancellationRuleId, }).select({ cancellationRules: 1 });
        return Response.json(rentedCar.cancellationRules[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
