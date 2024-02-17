'use server'
import connectDB from '@/app/_conf/database/connection'
import { authBannerModel } from '@/app/_models/auth-banner'

export const fetchAuthBanners = async () => {
    // Database connection
    connectDB()
    // Fetching auth banners
    try {
        let authBanners = await authBannerModel.find({ isActive: true }).lean();
        return JSON.parse(JSON.stringify(authBanners))
    } catch (error) {
        return { error: `Fetching auth banners failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}` : ''}` }
    }
}