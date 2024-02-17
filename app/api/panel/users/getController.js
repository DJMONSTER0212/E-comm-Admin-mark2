import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'

export const users = async ({ req, params, session }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('nameOrEmail')) {
        matchQuery.$or = [
            { name: { $regex: new RegExp(`.*${searchParams.get('nameOrEmail')}.*`, "i") } },
            { email: { $regex: new RegExp(`.*${searchParams.get('nameOrEmail')}.*`, "i") } },
        ];
    }
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('email')) {
        matchQuery.email = { $regex: new RegExp(`.*${searchParams.get('email')}.*`, "i") }
    }
    if (searchParams.get('phone')) {
        matchQuery.phone = { $regex: new RegExp(`.*${searchParams.get('phone')}.*`, "i") }
    }
    if (searchParams.get('status')) {
        matchQuery.isBlock = { $in: searchParams.get('status').toString().split('.').map((item) => item === 'true') }
    }
    if (searchParams.get('role')) {
        let roles = searchParams.get('role').toString().split('.');
        // Exclude super admin from results
        if (session.user.role !== 'sadmin') {
            roles = roles.map((item) => item != 'sadmin');
        }
        matchQuery.role = { $in: roles }
    } else {
        if (session.user.role !== 'sadmin') {
            matchQuery.role = { $ne: 'sadmin' }
        }
    }
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 20;
    // Database connection
    connectDB()
    // Fetching users
    let users;
    try {
        const sortQuery = { createdAt: 1 };
        users = await userModel.aggregate([
            { $match: matchQuery },
            { $sort: sortQuery },
            { $skip: (Number(page) - 1) * Number(perPage) },
            { $limit: Number(perPage) },
        ]);
    } catch (error) {
        return Response.json({ error: `Fetching users failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Fetching page count
    let totalUsers;
    try {
        totalUsers = await userModel.countDocuments(matchQuery);
    } catch (error) {
        return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    return Response.json({ users, pageCount: Math.ceil(totalUsers / perPage) }, { status: 200 })
}
