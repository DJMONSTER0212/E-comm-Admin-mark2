import connectDB from '@/app/_conf/database/connection'
import { couponModel } from '@/app/_models/coupon'

export const postCoupon = async ({ req, params, session }) => {
    const body = await req.formData();
    const updateFields = {
        coupon: body.get('coupon'),
        shortDesc: body.get('shortDesc'),
        type: body.get('type'),
        validOn: body.get('validOn'),
        discountType: body.get('discountType'),
        priceFormat: body.get('priceFormat'),
        price: body.get('price'),
        maxUsage: body.get('maxUsage'),
        expirationDate: body.get('expirationDate'),
        isActive: body.get('isActive'),
        allowMultipleUsage: body.get('allowMultipleUsage'),
        makePublic: body.get('makePublic')
    }
    // Check for existing coupon with same code
    try {
        let existingCoupon = await couponModel.countDocuments({ coupon: updateFields.coupon });
        if (existingCoupon > 0) {
            return Response.json({ error: `Coupon with same code already exists.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for existing same coupon with this code failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Check coupon type
    switch (updateFields.type) {
        case 'userOnly':
            if (body.get('userId')) {
                updateFields.userId = body.get('userId');
            } else {
                return Response.json({ error: `User is required for a user only coupon.` }, { status: 400 })
            }
            break;
        default:
            break;
    }
    // Check coupon valid on
    switch (updateFields.validOn) {
        case 'tour':
            if (body.get('tourId')) {
                updateFields.tourId = body.get('tourId');
            } else {
                return Response.json({ error: `Tour is required for coupon valid only on a tour.` }, { status: 400 })
            }
            break;
        case 'rentedCar':
            if (body.get('rentedCarId')) {
                updateFields.rentedCarId = body.get('rentedCarId');
            } else {
                return Response.json({ error: `Rented car is required for coupon valid only on a rented car.` }, { status: 400 })
            }
            break;
        default:
            break;
    }
    // Check discount type
    switch (updateFields.discountType) {
        case 'upto':
            if (body.get('maxPrice')) {
                updateFields.maxPrice = Number(body.get('maxPrice'));
            } else {
                return Response.json({ error: `Max price is required for an upto discount type coupon.` }, { status: 400 })
            }
            break;
        default:
            break;
    }
    // Database connection
    connectDB()
    // Adding new coupon
    try {
        const newCoupon = new couponModel(updateFields)
        await newCoupon.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding coupon failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}