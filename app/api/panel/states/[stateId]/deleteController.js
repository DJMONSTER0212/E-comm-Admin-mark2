import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'

export const deleteState = async ({ req, params, session }) => {
    const { stateId } = params
    if (!stateId) {
        return Response.json({ error: `State id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check state exist or not
    try {
        const isStateExist = await stateModel.countDocuments({ _id: stateId });
        if (isStateExist == 0) {
            return Response.json({ error: `State is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for state existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting state
    try {
        await stateModel.deleteOne({ _id: stateId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting state failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}