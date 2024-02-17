import connectDB from '@/app/_conf/database/connection'
import { userModel } from '@/app/_models/user'
import bcrypt from 'bcrypt'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const postUser = async ({ req, params, session }) => {
    const body = await req.formData();
    const updateFields = {
        name: body.get('name'),
        email: body.get('email'),
        phone: body.get('phone') || '',
        password: bcrypt.hashSync(body.get('password'), 10),
        isBlock: body.get('isBlock') || false,
        isVerified: body.get('isVerified') || false,
        role: body.get('role'),
        signedInWith: 'credentials'
    }
    // Avoid creating a super admin
    if (session.user.role !== 'sadmin' && updateFields.role == 'sadmin') {
        return Response.json({ error: "You can't add a super admin" }, { status: 400 })
    }
    // Image file handling >>>>>>>>>>>>>>
    if (typeof body.get('image') !== 'string') {
        // Uploading file
        try {
            updateFields.image = await s3Upload(body.get('image'), 'users');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    }
    // Database connection
    connectDB()
    // Check for existing email
    try {
        let existingUser = await userModel.countDocuments({ email: updateFields.email })
        if (existingUser) {
            return Response.json({ error: `Another user with this email already exists.` }, { status: 400 })
        }
    } catch (error) {
        return Response.json({ error: `Checking for existing user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Adding new user
    try {
        const newUser = new userModel(updateFields)
        await newUser.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding user failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}