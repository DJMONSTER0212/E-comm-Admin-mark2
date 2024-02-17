import { s3Client } from "./s3-client";
import connectDB from "../database/connection";
import { settingModel } from '@/app/_models/setting'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto'

// To get extension
function getFileExtension(body) {
    const lastDotIndex = body.name.lastIndexOf(".");
    if (lastDotIndex !== -1) {
        return body.name.substring(lastDotIndex + 1);
    }
    return null;
}

export const s3Upload = async (body, folderPath) => {
    connectDB();
    const settings = await settingModel.findOne().lean()
    if (!settings?.s3Details?.bucketName || !settings.s3Details.bucketRegion || !settings.s3Details.accessKey || !settings.s3Details.secretKey || !settings.s3Details.uploadPath || !settings.s3Details.backupPath) {
        throw new Error('S3 details are not set up yet.')
    }
    if (!settings?.s3Details?.isActive) {
        throw new Error('S3 upload service is currently disabled.')
    }
    try {
        const fileExtension = getFileExtension(body);
        if (!fileExtension) {
            throw new Error("Invalid file type. Please try again.");
        }
        const timestamp = Date.now();
        const randomCode = crypto.randomBytes(16).toString("hex");
        const fileName = `${settings.s3Details.uploadPath}/${folderPath || 'files'}/${timestamp}-${randomCode}.${fileExtension}`;
        const command = new PutObjectCommand({
            Bucket: settings.s3Details.bucketName,
            Key: fileName,
            ContentType: body.type,
            Body: await body.arrayBuffer()
        });
        await s3Client(settings.s3Details.bucketRegion, settings.s3Details.accessKey, settings.s3Details.secretKey).send(command);
        const fileUrl = `https://${settings.s3Details.bucketName}.s3.${settings.s3Details.bucketRegion}.amazonaws.com/${fileName}`;
        return fileUrl;
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
}