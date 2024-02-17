import mongoose from "mongoose";
import { Schema } from "mongoose";

const homepageBannerSchema = new Schema({
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

export const homepageBannerModel = mongoose.models['homepage-banners'] || mongoose.model('homepage-banners', homepageBannerSchema);
