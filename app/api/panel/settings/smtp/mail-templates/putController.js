import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const putMailTemplatesSettings = async ({ req }) => {
    let { template, selectedTemplate } = await req.json();
    template = `mailTemplates.${template}`
    // Database connection
    connectDB()
    // Updating mail template
    try {
        await settingModel.updateOne({}, { $set: { [template]: selectedTemplate } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating mail template failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}