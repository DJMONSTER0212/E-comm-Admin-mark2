import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'

export const putPoliciesSettings = async ({ req }) => {
    const body = await req.json();
    const updateFields = {
        'policies.refundPolicy': body.refundPolicy,
        'policies.privacyPolicy': body.privacyPolicy,
        'policies.TermAndConditions': body.TermAndConditions,
    }
    // Database connection
    connectDB()
    // Updating settings
    try {
        await settingModel.updateOne({}, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}