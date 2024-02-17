import connectDB from '@/app/_conf/database/connection'
import { couponModel } from '@/app/_models/coupon'

export const patchCoupon = async ({ req, params, session }) => {
    const { couponId } = params
    if (!couponId) {
        return Response.json({ error: `Coupon id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    // Database connection
    connectDB()
    // Check coupon exist or not
    try {
        let coupon = await couponModel.findOne({ _id: couponId });
        if (!coupon) {
            return Response.json({ error: `Coupon not found.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for coupon failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Settings update fields according to action
    let updateFields = {};
    switch (body.action) {
        case 'isActive':
            updateFields = { isActive: body.isActive }
            break;
        default:
            break;
    }
    // Updating coupon
    try {
        await couponModel.updateOne({ _id: couponId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating coupon failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}