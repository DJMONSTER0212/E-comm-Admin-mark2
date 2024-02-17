import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'

export const putAdminSettings = async ({ req }) => {
    const body = await req.json();
    const updateFields = {
        'sadmin.activateWebsite': body.activateWebsite,
        'sadmin.activateMaintenanceMode': body.activateMaintenanceMode,
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