import connectDB from '@/app/_conf/database/connection'
import { hotelLeadModel } from '@/app/_models/hotel-lead'

export const patchHotelLead = async ({ req, params, session }) => {
    const { hotelLeadId } = params
    if (!hotelLeadId) {
        return Response.json({ error: `Hotel lead id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating hotel lead
    try {
        await hotelLeadModel.updateOne({ _id: hotelLeadId }, { $set: { status: body.status } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating hotel lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}