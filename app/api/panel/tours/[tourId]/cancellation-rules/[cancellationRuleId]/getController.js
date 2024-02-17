import connectDB from '@/app/_conf/database/connection'
import { tourModel } from '@/app/_models/tour'

export const cancellationRule = async ({ req, params, session }) => {
    const { cancellationRuleId, tourId } = params
    if (!cancellationRuleId || !tourId) {
        return Response.json({ error: `Tour id and cancellation rule id are required to fetch cancellation rule.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching tour to get cancellation rule
    try {
        let tour = await tourModel.findOne({ _id: tourId, 'cancellationRules._id': cancellationRuleId, }).select({ cancellationRules: 1 });
        return Response.json(tour.cancellationRules[0], { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching cancellation rule failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
