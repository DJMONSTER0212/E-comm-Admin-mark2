import connectDB from '@/app/_conf/database/connection'
import { contactLeadModel } from '@/app/_models/contact-lead';

export const putContactLead = async ({ req, params }) => {
    const { contactLeadId } = params
    const body = await req.json();
    const updateFields = {
        status: body.status,
    }
    // Database connection
    connectDB()
    // Updating contact lead
    try {
        await contactLeadModel.updateOne({ _id: contactLeadId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating contact lead failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}