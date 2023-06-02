const AWS = require("aws-sdk");
const multer = require("multer");
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const S3 = new AWS.S3(awsConfig);

let upload = multer({
  limits: 1024 * 1024 * 5,
  fileFilter: function (req, file, done) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jng" ||
      file.mimetype === "image/jpg"
    ) {
      done(null, true);
    } else {
      done("multer error- file type is not supported", false);
    }
  },
});
// upload to s3 bucket
const uploadToS3 = (fileData) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${Date.now().toString()}`,
      Body: fileData,
    };

    //console.log("uploadToS3 working fine")

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      // console.log("uploadToS3 inside")
      console.log(data);
      return resolve(data);
    });
  });
};

module.exports = { uploadToS3 };
