import connectDB from '@/app/_conf/database/connection'
import { visaLeadModel } from '@/app/_models/visa-lead'

export const visaLead = async ({ req, params }) => {
    const { visaLeadId } = params
    if (!visaLeadId) {
        return Response.json({ error: `Category id is required to fetch visa lead.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching visa lead
    try {
        let visaLead = await visaLeadModel.findOne({ _id: visaLeadId });
        return Response.json(visaLead, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching visa lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
