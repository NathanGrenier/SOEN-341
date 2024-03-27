import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client({
  region: process.env.BLOB_S3_REGION,
});

export const list = async (): Promise<{
  blobs: {
    size: number;
    uploadedAt: Date;
    pathname: string;
    url: string;
    downloadUrl: string;
  }[];
  hasMore: false;
}> => {
  return {
    blobs: [
      {
        size: 1,
        uploadedAt: new Date(),
        pathname: "hi",
        url: "hi",
        downloadUrl: "hi",
      },
    ],
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
  //const url = `https://${process.env.BLOB_S3_BUCKET}.s3.${process.env.BLOB_S3_REGION}.amazonaws.com/${encodeURIComponent(filename)}`;
  const downloadUrl =
    process.env.BLOB_CLOUDFRONT_DIST + encodeURIComponent(filename);

  return { url: downloadUrl, downloadUrl };
};
