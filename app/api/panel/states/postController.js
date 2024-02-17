import connectDB from '@/app/_conf/database/connection'
import { stateModel } from '@/app/_models/state'

export const postState = async ({ req }) => {
    const state = await req.json();
    // Database connection
    connectDB()
    // Adding state
    try {
        const newState = new stateModel(state);
        await newState.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding state failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}