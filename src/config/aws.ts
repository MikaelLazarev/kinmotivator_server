import fs = require('fs');
import S3 = require('aws-sdk/clients/s3');

export function getAWSconfig(): S3.Types.ClientConfiguration | null {
  const exists = fs.existsSync('./aws.json');
  if (exists) {
    try {
      let rawdata = fs.readFileSync('config.json');
      let config = JSON.parse(rawdata.toString());
      return <S3.Types.ClientConfiguration>{
        accessKeyId: config.AWS_ID,
        secretAccessKey: config.AWS_SECRET,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  } else {
    return <S3.Types.ClientConfiguration>{
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
      // region: 'eu-north-1',
    };
  }
}
