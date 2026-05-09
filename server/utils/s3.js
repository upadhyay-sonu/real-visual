import fs from 'fs';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client = null;

if (process.env.USE_S3 === 'true') {
  try {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    console.log('AWS S3 initialized');
  } catch (err) {
    console.error('Failed to initialize AWS S3 client:', err);
  }
}

export const uploadFileToS3 = async (filePath, filename) => {
  if (!s3Client) {
    throw new Error('S3 Client not configured');
  }

  const fileStream = fs.createReadStream(filePath);
  const bucketName = process.env.AWS_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: fileStream,
    ContentType: 'model/gltf-binary' // For .glb
  });

  await s3Client.send(command);
  
  return {
    bucket: bucketName,
    key: filename
  };
};

export const deleteFileFromS3 = async (filename) => {
  if (!s3Client) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
  });

  await s3Client.send(command);
};

export const generateSignedUrl = async (filename) => {
  if (!s3Client) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
  });

  // URL expires in 1 hour
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
