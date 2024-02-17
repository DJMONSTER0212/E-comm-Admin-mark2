import connectDB from '@/app/_conf/database/connection'
import { hotelLeadModel } from '@/app/_models/hotel-lead'

export const hotelLead = async ({ req, params }) => {
    const { hotelLeadId } = params
    if (!hotelLeadId) {
        return Response.json({ error: `Category id is required to fetch hotel lead.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching hotel lead
    try {
        let hotelLead = await hotelLeadModel.findOne({ _id: hotelLeadId });
        return Response.json(hotelLead, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching hotel lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
