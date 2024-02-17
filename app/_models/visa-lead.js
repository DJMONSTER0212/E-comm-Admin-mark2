import mongoose from "mongoose";
import { Schema } from "mongoose";
import { leadStatuses } from "../_conf/constants/constant";

const visaLeadSchema = new Schema({
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
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: leadStatuses.map((status) => status.value),
        required: true,
    }
}, { timestamps: true });

export const visaLeadModel = mongoose.models["visa-leads"] || mongoose.model('visa-leads', visaLeadSchema);
