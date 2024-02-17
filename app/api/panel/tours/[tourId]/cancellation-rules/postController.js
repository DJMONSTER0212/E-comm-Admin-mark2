import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const postCancellationRule = async ({ req, params, session }) => {
    const { tourId } = params
    const body = await req.json();
    const updateFields = {
        refundablePrice: body.refundablePrice,
        hoursBeforeStartingTime: body.hoursBeforeStartingTime,
        rule: body.rule,
    }
    // Database connection
    connectDB()
    // Adding new cancellation rule
    try {
        await tourModel.updateOne({ _id: tourId }, { $push: { cancellationRules: updateFields } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}