import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putUser = async ({ req, params, session }) => {
    const { userId } = params
    const body = await req.formData();
    const updateFields = {
        name: body.get('name'),
        email: body.get('email'),
        phone: body.get('phone') || '',
        isBlock: body.get('isBlock') || false,
        isVerified: body.get('isVerified') || false,
        role: body.get('role')
    }
    // Avoid creating or modifying a super admin
    if (session.user.role !== 'sadmin' && updateFields.role == 'sadmin') {
        return Response.json({ error: "You can't create or modify a super admin" }, { status: 400 })
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'users');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields.image = body.get('image')
    }
    // Database connection
    connectDB()
    // Check for existing email
    try {
        let existingUser = await userModel.countDocuments({ _id: { $ne: userId }, email: updateFields.email })
        if (existingUser) {
            return Response.json({ error: `Another user with this email already exists.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for existing user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Updating user
    try {
        await userModel.updateOne({ _id: userId }, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}