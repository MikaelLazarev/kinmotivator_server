import S3 = require('aws-sdk/clients/s3');
import { getAWSconfig} from '../config/aws';

export class AWSService {
  private s3: S3 | null;
  private bucket: string;

  constructor(bucket: string) {
    const config = getAWSconfig()
    this.s3 = config ? new S3(config) : new S3();
    if (!this.s3) {
      console.log("EERR")
    }
    this.bucket = bucket;
//
  }


  uploadFile(fileContent: S3.Body, filename: string): Promise<string> {

    console.log(fileContent)
    console.log(this.bucket)

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
        try {
          this.s3.upload(
            params,
            (err: Error, data: S3.ManagedUpload.SendData) => {
              if (err) {
                reject('There was an error uploading your file: ' + err);
                return
              }
              console.log('Successfully uploaded file.', data);
              resolve(data.Location);
            },
          );
        }catch(e) {
          console.log(e)
          reject(e);
        }
      }
    });
  }
}
