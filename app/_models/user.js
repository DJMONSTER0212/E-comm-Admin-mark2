import mongoose from "mongoose";
import { Schema } from "mongoose";
import { userRoles } from '@/app/_conf/constants/constant';

const userSchema = new Schema({
    image: {
        type: String,
        default: '/panel/images/newUser.webp',
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
    },
    isBlock: {
        type: Boolean,
        default: false,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: false,
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpirationTime: {
        type: String,
        required: false,
    },
    remainingValidationAttempts: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    signedInWith: {
        type: String,
        enum: [
            'credentials',
            'google',
        ],
        required: true,
    },
    role: {
        type: String,
        enum: userRoles.map((role) => role.value),
        required: true,
    }
}, { timestamps: true });


userSchema.index({ name: 1 });

export const userModel = mongoose.models.users || mongoose.model('users', userSchema);
