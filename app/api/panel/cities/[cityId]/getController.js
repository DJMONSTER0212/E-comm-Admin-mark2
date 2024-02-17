import connectDB from '@/app/_conf/database/connection'
import { cityModel } from '@/app/_models/city'

export const city = async ({ req, params }) => {
    const { cityId } = params
    if (!cityId) {
        return Response.json({ error: `City id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching city
    try {
        let city = await cityModel.findOne({ _id: cityId });
        return Response.json(city, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching city failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
