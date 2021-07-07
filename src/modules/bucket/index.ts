    import { S3Client, PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3"
import { Readable } from 'stream'

export async function upload(Bucket: string, ContentType: string, Key: string, blob: string):  Promise<PutObjectCommandOutput> {
    console.log(process.env.AWS_PROFILE)
    const s3 = new S3Client({ region: process.env.AWS_REGION })

    const stream = new Readable()
    stream.push(blob)
    stream.push(null)

    try {
        const data =  await s3.send(
            new PutObjectCommand({
                Bucket,
                Key,
                Body: stream.read(),
                ContentType
            })
        )
        return data
    } catch(err) {
        throw err
    }
}
