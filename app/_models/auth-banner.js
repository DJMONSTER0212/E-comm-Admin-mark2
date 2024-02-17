import mongoose from "mongoose";
import { Schema } from "mongoose";

const authBannerSchema = new Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    shortDesc: {
        type: String,
    },
    btnTitle: {
        type: String,
    },
    link: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true });

export const authBannerModel = mongoose.models['auth-banners'] || mongoose.model('auth-banners', authBannerSchema);
