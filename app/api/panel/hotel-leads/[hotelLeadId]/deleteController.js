import connectDB from '@/app/_conf/database/connection'
import { hotelLeadModel } from '@/app/_models/hotel-lead'

export const deleteHotelLead = async ({ req, params, session }) => {
    const { hotelLeadId } = params
    if (!hotelLeadId) {
        return Response.json({ error: `Hotel lead id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check hotel lead exist or not
    try {
        const isHotelLeadExist = await hotelLeadModel.countDocuments({ _id: hotelLeadId });
        if (isHotelLeadExist == 0) {
            return Response.json({ error: `Hotel lead is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for hotel lead existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting hotel lead
    try {
        await hotelLeadModel.deleteOne({ _id: hotelLeadId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting hotel lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}