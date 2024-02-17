import mongoose from "mongoose";
import { Schema } from "mongoose";
import { leadStatuses, leadContactServices } from "../_conf/constants/constant";

const contactLeadSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        enum: leadContactServices.map((service) => service.value),
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: leadStatuses.map((status) => status.value),
        required: true,
    }
}, { timestamps: true });

export const contactLeadModel = mongoose.models["contact-leads"] || mongoose.model('contact-leads', contactLeadSchema);
