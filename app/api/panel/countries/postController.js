import connectDB from '@/app/_conf/database/connection'
import { countryModel } from '@/app/_models/country'

export const postCountry = async ({ req }) => {
    const country = await req.json();
    // Database connection
    connectDB()
    // Adding country
    try {
        const newCountry = new countryModel(country);
        await newCountry.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding country failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}