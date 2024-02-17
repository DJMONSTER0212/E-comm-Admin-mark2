import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'

export const putCountry = async ({ req, params, session }) => {
    const { countryId } = params
    if (!countryId) {
        return Response.json({ error: `Country id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        name: body.name,
        isActive: body.isActive,
    }
    // Database connection
    connectDB()
    // Updating country
    try {
        await countryModel.updateOne({ _id: countryId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}