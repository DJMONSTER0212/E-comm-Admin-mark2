import connectDB from '@/app/_conf/database/connection'
import { contactLeadModel } from '@/app/_models/contact-lead'

export const contactLead = async ({ req, params }) => {
    const { contactLeadId } = params
    if (!contactLeadId) {
        return Response.json({ error: `Category id is required to fetch contact lead.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching contact lead
    try {
        let contactLead = await contactLeadModel.findOne({ _id: contactLeadId });
        return Response.json(contactLead, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching contact lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
