import connectDB from '@/app/_conf/database/connection'
import { settingModel } from '@/app/_models/setting'
import { s3Upload } from '@/app/_conf/aws-s3-client/s3-operations';

export const putGeneralSettings = async ({ req }) => {
    const body = await req.formData();
    const updateFields = {
        'general.name': body.get('name'),
        'general.companyName': body.get('companyName'),
        'general.currencySymbol': body.get('currencySymbol'),
    }
    // Light logo image file handling >>>>>>>>>>>>>>
    if (typeof body.get('lightLogo') !== 'string') {
        // Uploading file
        try {
            updateFields['general.lightLogo'] = await s3Upload(body.get('lightLogo'), 'logos');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields['general.lightLogo'] = body.get('lightLogo') || '';
    }
    // Dark logo image file handling >>>>>>>>>>>>>>
    if (typeof body.get('darkLogo') !== 'string') {
        // Uploading file
        try {
            updateFields['general.darkLogo'] = await s3Upload(body.get('darkLogo'), 'logos');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields['general.darkLogo'] = body.get('darkLogo') || '';
    }
    // Email logo image file handling >>>>>>>>>>>>>>
    if (typeof body.get('emailLogo') !== 'string') {
        // Uploading file
        try {
            updateFields['general.emailLogo'] = await s3Upload(body.get('emailLogo'), 'logos');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields['general.emailLogo'] = body.get('emailLogo') || '';
    }
    // Fevicon logo image file handling >>>>>>>>>>>>>>
    if (typeof body.get('faviconLogo') !== 'string') {
        // Uploading file
        try {
            updateFields['general.faviconLogo'] = await s3Upload(body.get('faviconLogo'), 'logos');
        } catch (error) {
            return Response.json({ error: error.message }, { status: 400 })
        }
    } else {
        updateFields['general.faviconLogo'] = body.get('faviconLogo') || '';
    }
    // Database connection
    connectDB()
    // Updating settings
    try {
        await settingModel.updateOne({}, { $set: updateFields });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Updating settings failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}