import connectDB from '@/app/_conf/database/connection'
import { cityModel } from '@/app/_models/city'

export const patchCity = async ({ req, params, session }) => {
    const { cityId } = params
    if (!cityId) {
        return Response.json({ error: `City id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating city
    try {
        await cityModel.updateOne({ _id: cityId }, { $set: { isActive: body.isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating city failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}