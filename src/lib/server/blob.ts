import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
const client = new S3Client({
  region: process.env.BLOB_S3_REGION,
});

type BlobDescription = {
  size: number;
  uploadedAt: Date;
  pathname: string;
  url: string;
  downloadUrl: string;
};

export const list = async (): Promise<{
  blobs: BlobDescription[];
  hasMore: boolean;
}> => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BLOB_S3_BUCKET,
  });
  const result = await client.send(command);
  const translation: BlobDescription[] = [];
  for (const item of result.Contents || []) {
    const downloadUrl =
      process.env.BLOB_CLOUDFRONT_DIST + encodeURIComponent(item.Key || "");
    translation.push({
      size: item.Size || 0,
      uploadedAt: item.LastModified || new Date(),
      pathname: item.Key || "",
      url: downloadUrl,
      downloadUrl: downloadUrl,
    });
  }

  return {
    blobs: translation,
    hasMore: false,
  };
};

// options: access: public constant for Vercel compatibility
export const put = async (
  filename: string,
  body: File,
  options: { access: "public" }, // eslint-disable-line
): Promise<{ url: string; downloadUrl: string }> => {
  // Ensure that each upload results in a unique S3 object
  filename = crypto.randomUUID() + "-" + filename;

  const command = new PutObjectCommand({
    Bucket: process.env.BLOB_S3_BUCKET,
    Key: filename,
    Body: await body.arrayBuffer(),
  });

  await client.send(command);
  // non-CloudFront URL would be
  // `https://${process.env.BLOB_S3_BUCKET}.s3.${process.env.BLOB_S3_REGION}.amazonaws.com/${encodeURIComponent(filename)}`;
  // but that isn't really needed
  const downloadUrl =
    process.env.BLOB_CLOUDFRONT_DIST + encodeURIComponent(filename);

  return { url: downloadUrl, downloadUrl };
};
