import connectDB from '@/app/_conf/database/connection'
import { visaLeadModel } from '@/app/_models/visa-lead'

export const deleteVisaLead = async ({ req, params, session }) => {
    const { visaLeadId } = params
    if (!visaLeadId) {
        return Response.json({ error: `Visa lead id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check visa lead exist or not
    try {
        const isVisaLeadExist = await visaLeadModel.countDocuments({ _id: visaLeadId });
        if (isVisaLeadExist == 0) {
            return Response.json({ error: `Visa lead is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for visa lead existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting visa lead
    try {
        await visaLeadModel.deleteOne({ _id: visaLeadId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting visa lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}