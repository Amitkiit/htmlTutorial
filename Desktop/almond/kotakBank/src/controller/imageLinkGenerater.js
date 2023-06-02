const { uploadToS3 } = require("../aws/aws");

const linkGenerate = async function (req, res) {
  try {
    if (req.file) {
      uploadToS3(req.file.buffer)
        .then((result) => {
          return res
            .status(201)
            .send({
              msg: "image upload successfully",
              imageUrl: result.Location,
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { linkGenerate };
