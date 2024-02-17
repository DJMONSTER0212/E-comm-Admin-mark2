import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'

export const patchCountry = async ({ req, params, session }) => {
    const { countryId } = params
    if (!countryId) {
        return Response.json({ error: `Country id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating country
    try {
        await countryModel.updateOne({ _id: countryId }, { $set: { isActive: body.isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}