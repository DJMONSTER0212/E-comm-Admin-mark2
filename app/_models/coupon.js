import mongoose from "mongoose";
import { Schema } from "mongoose";

const couponSchema = new Schema({
    coupon: {
        type: String,
        required: true,
        unique: true
    },
    shortDesc: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: ['regular', 'userOnly'],
        required: true,
    },
    validOn: {
        type: String,
        enum: [
            'all',
            'allTours',
            'tour',
            'allRentedCars',
            'rentedCar',
        ],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false,
    },
    tourId: {
        type: Schema.Types.ObjectId,
        ref: 'tours',
        required: false,
    },
    rentedCarId: {
        type: Schema.Types.ObjectId,
        ref: 'rented-cars',
        required: false,
    },
    discountType: {
        type: String,
        enum: ['flat', 'upto'],
        required: true,
    },
    priceFormat: {
        type: String,
        enum: ['percentage', 'raw'],
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: false
    },
    maxUsage: {
        type: Number,
        required: true,
        default: 1
    },
    allowMultipleUsage: {
        type: Boolean,
        default: false,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    makePublic: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export const couponModel = mongoose.models['coupons'] || mongoose.model('coupons', couponSchema);
