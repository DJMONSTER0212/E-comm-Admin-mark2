import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'

export const patchState = async ({ req, params, session }) => {
    const { stateId } = params
    if (!stateId) {
        return Response.json({ error: `State id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Updating state
    try {
        await stateModel.updateOne({ _id: stateId }, { $set: { isActive: body.isActive } });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating state failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}