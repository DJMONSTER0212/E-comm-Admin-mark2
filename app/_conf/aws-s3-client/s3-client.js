import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = (bucketRegion, accessKey, secretKey) => {
    return new S3Client({
        region: bucketRegion,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        }
    })
};