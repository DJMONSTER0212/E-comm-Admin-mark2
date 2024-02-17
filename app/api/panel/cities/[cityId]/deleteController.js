import connectDB from '@/app/_conf/database/connection'
import { cityModel } from '@/app/_models/city'

export const deleteCity = async ({ req, params, session }) => {
    const { cityId } = params
    if (!cityId) {
        return Response.json({ error: `City id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check city exist or not
    try {
        const isCityExist = await cityModel.countDocuments({ _id: cityId });
        if (isCityExist == 0) {
            return Response.json({ error: `City is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for city existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting city
    try {
        await cityModel.deleteOne({ _id: cityId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting city failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}