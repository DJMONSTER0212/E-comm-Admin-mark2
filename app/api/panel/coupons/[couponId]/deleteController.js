import connectDB from '@/app/_conf/database/connection'
import { couponModel } from '@/app/_models/coupon'

export const deleteCoupon = async ({ req, params, session }) => {
    const { couponId } = params
    if (!couponId) {
        return Response.json({ error: `Coupon id is required to perform this action.` }, { status: 400 })
    }
    // Database connection
    connectDB()
    // Check coupon exist or not
    let coupon;
    try {
        coupon = await couponModel.findOne({ _id: couponId });
        if (!coupon) {
            return Response.json({ error: `Coupon is already deleted.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for coupon existence failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Deleting coupon
    try {
        await couponModel.deleteOne({ _id: couponId });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Deleting coupon failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}