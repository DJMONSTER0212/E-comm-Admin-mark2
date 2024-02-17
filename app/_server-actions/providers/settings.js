'use server'
import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'

export const fetchGeneralSettings = async () => {
    // Database connection
    connectDB()
    // Fetching settings
    try {
        let settings = await settingModel.findOne().select({ 'general': 1 }).lean();
        return JSON.parse(JSON.stringify(settings))
    } catch (error) {
        throw new Error("Fethcing settings failed")
    }
}