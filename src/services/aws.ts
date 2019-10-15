import S3 = require('aws-sdk/clients/s3');
import { getAWSconfig} from '../config/aws';

export class AWSService {
  private s3: S3 | null;
  private bucket: string;

  constructor(bucket: string) {
    const config = getAWSconfig()
    console.log(config)

    this.s3 = config ? new S3(config) : new S3();
    this.bucket = bucket;
  }

  uploadFile(fileContent: S3.Body, filename: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: filename, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read',
    };

    // Uploading files to the bucket
    return new Promise<string>((resolve, reject) => {
      if (!this.s3) {
        reject('No AWS instance');
      } else {
        this.s3.upload(
          params,
          (err: Error, data: S3.ManagedUpload.SendData) => {
            if (err) {
              reject('There was an error uploading your file: ' + err);
            }
            console.log('Successfully uploaded file.', data);
            resolve(data.Location);
          },
        );
      }
    });
  }
}
