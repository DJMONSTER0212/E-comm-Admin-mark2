import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'

export const state = async ({ req, params }) => {
    const { stateId } = params
    if (!stateId) {
        return Response.json({ error: `State id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Fetching state
    try {
        let state = await stateModel.findOne({ _id: stateId });
        return Response.json(state, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Fetching state failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}
