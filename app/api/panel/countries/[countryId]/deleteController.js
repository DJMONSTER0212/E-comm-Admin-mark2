import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'
import { stateModel } from '@/app/_models/state'

export const deleteCountry = async ({ req, params, session }) => {
    const { countryId } = params
    if (!countryId) {
        return Response.json({ error: `Country id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check country exist or not
    try {
        const isCountryExist = await countryModel.countDocuments({ _id: countryId });
        if (isCountryExist == 0) {
            return Response.json({ error: `Country is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for country existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting states in this country
    try {
        await stateModel.deleteMany({ countryId: countryId });
    } catch (error) {
        return Response.json({ error: `Deleting states for this country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting country
    try {
        await countryModel.deleteOne({ _id: countryId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}