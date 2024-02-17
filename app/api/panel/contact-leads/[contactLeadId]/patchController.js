import connectDB from '@/app/_conf/database/connection'
import { contactLeadModel } from '@/app/_models/contact-lead'

export const patchContactLead = async ({ req, params, session }) => {
    const { contactLeadId } = params
    if (!contactLeadId) {
        return Response.json({ error: `Contact lead id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating contact lead
    try {
        await contactLeadModel.updateOne({ _id: contactLeadId }, { $set: { status: body.status } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating contact lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}