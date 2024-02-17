import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting';

export const putInfo = async ({ req, params }) => {
    const body = await req.json();
    const updateFields = {
        'general.info': {
            inquiryMail: body.inquiryMail || '',
            inquiryPhone: body.inquiryPhone || '',
            inquiryPhone2: body.inquiryPhone2 || '',
            whatsappPhone: body.whatsappPhone || '',
            address: body.address || '',
            footerPara: body.footerPara || '',
        }
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