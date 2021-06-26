import { Client } from 'minio'
import { Readable } from 'stream'

export async function upload(bucket: string, location: string, blob: string): Promise<void> {
    const minioClient = new Client({
        endPoint: 's3.amazonaws.com',
        accessKey: process.env.AWS_ACCESS_KEY as string,
        secretKey: process.env.AWS_SECRET_KEY as string
    });

    return new Promise((resolve, reject) => {
        const fs = new Readable()
        fs.push(blob)
        fs.push(null) 

        minioClient.putObject(bucket, location, fs, async function(err: Error) {
            if(err) {
                reject(err)
            }

            resolve()
        })
    }) 
}