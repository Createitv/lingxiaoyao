import COS from "cos-nodejs-sdk-v5";

let cosClient: COS | null = null;

function getCOS(): COS {
  if (!cosClient) {
    cosClient = new COS({
      SecretId: process.env.TENCENT_SECRET_ID!,
      SecretKey: process.env.TENCENT_SECRET_KEY!,
    });
  }
  return cosClient;
}

export async function uploadToCOS(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const cos = getCOS();
  const bucket = process.env.TENCENT_COS_BUCKET!;
  const region = process.env.TENCENT_COS_REGION!;

  await new Promise<void>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });

  return `https://${bucket}.cos.${region}.myqcloud.com/${key}`;
}
