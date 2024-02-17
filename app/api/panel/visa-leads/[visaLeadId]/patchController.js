import connectDB from '@/app/_conf/database/connection'
import { visaLeadModel } from '@/app/_models/visa-lead'

export const patchVisaLead = async ({ req, params, session }) => {
    const { visaLeadId } = params
    if (!visaLeadId) {
        return Response.json({ error: `Visa lead id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating visa lead
    try {
        await visaLeadModel.updateOne({ _id: visaLeadId }, { $set: { status: body.status } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating visa lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}