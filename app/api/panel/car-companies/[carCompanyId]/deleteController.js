import connectDB from '@/app/_conf/database/connection'
import { carCompanyModel } from '@/app/_models/car-company'

export const deleteCarCompany = async ({ req, params, session }) => {
    const { carCompanyId } = params
    if (!carCompanyId) {
        return Response.json({ error: `Car company id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check car company exist or not
    try {
        const isCarCompanyExist = await carCompanyModel.countDocuments({ _id: carCompanyId });
        if (isCarCompanyExist == 0) {
            return Response.json({ error: `Car company is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for car company existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting car company
    try {
        await carCompanyModel.deleteOne({ _id: carCompanyId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting car company failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}