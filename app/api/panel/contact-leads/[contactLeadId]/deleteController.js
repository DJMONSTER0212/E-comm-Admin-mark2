import connectDB from '@/app/_conf/database/connection'
import { contactLeadModel } from '@/app/_models/contact-lead'

export const deleteContactLead = async ({ req, params, session }) => {
    const { contactLeadId } = params
    if (!contactLeadId) {
        return Response.json({ error: `Contact lead id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check contact lead exist or not
    try {
        const isContactLeadExist = await contactLeadModel.countDocuments({ _id: contactLeadId });
        if (isContactLeadExist == 0) {
            return Response.json({ error: `Contact lead is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for contact lead existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting contact lead
    try {
        await contactLeadModel.deleteOne({ _id: contactLeadId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting contact lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}