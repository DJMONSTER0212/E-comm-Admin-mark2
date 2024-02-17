import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'


export const putMailsSettings = async ({ req }) => {
    let { mailSetup, mailAddresses } = await req.json();
    mailSetup = `mails.${mailSetup}`
    // Database connection
    connectDB()
    // Updating mail addresses
    try {
        await settingModel.updateOne({}, { $set: { [mailSetup]: mailAddresses } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating mail addresses failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}