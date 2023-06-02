const db = require("../models/mainModel");
const bcrypt = require("bcrypt");
const moment = require("moment");
const mysql = require("mysql");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { validMobile, validPassword } = require("../validator/validator");

const Users = db.userDetails;
const Otps = db.otphistorys;

//================user Creation ===========================================================//

const createUser = async function (req, res) {
  try {
    let data = req.body;
  const { name, mobileNumber, password, upload_logo } = data;
  if (!name)
    return res
      .status(400)
      .send({ status: false, message: "pls enter your name" });
  if (!validMobile(mobileNumber))
    return res
      .status(400)
      .send({ status: false, message: "pls enter valid mobileNumber" });
  if (!validPassword(password))
    return res
      .status(400)
      .send({ status: false, message: "pls enter valid password" });
  let uniqueNumber = await Users.findOne({
    where: {
      mobileNumber: mobileNumber,
    },
  });
  if (uniqueNumber)
    return res
      .status(400)
      .send({ status: false, message: "this number is already exist" });
  let saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, 10);
  data.password = hashedPassword;

  let createUser = await Users.create(data);
  res.status(201).send({
    status: true,
    message: "data create successfully",
    data: createUser,
  });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
    
  }
};

//===================login the user===========================//

const loginUser = async function (req, res) {
 try {
  let data = req.body;
  const { name, mobileNumber } = data;
  let user = await Users.findOne({
    where: {
      name: name,
      mobileNumber: mobileNumber,
    },
  });

  if (user) {
    function otpGenerator() {
      let otpCreation = Math.floor(Math.random() * 1000000);
      return otpCreation;
    }
    let store = otpGenerator();
    const expirationTime = Date.now() + 1 * 60 * 1000;

    await Users.update(
      {
        otp: store,
        expire_In: expirationTime,
      },
      {
        where: {
          name: name,
          mobileNumber: mobileNumber,
        },
      }
    );
    await Otps.create({
      mobileNumber: mobileNumber,
      otp: store,
    });
    let checkData = await Users.findOne({
      where: {
        name: name,
        mobileNumber: mobileNumber,
      },
    });
    let token = jwt.sign(
      { user_mobileNumber: user.mobileNumber },
      "process.env.SIGNATURE"
    );
    res.header("x-api-key", token);
    res.status(200).send({
      status: true,
      message: "otp send on register mobile Number",
      otp: store,
      token: token,
    });
  } else if (!user)
    return res
      .status(200)
      .send({ status: false, message: "user are not register" });
  
 } catch (error) {
  res.status(500).send({ status: false, error: error.message });
 }
};

//================verify the otp ================================================//

const verifyOtp = async function (req, res) {
  let data = req.body;
  let { otp, mobileNumber } = data;
  let checkOtpVerification = await Users.findOne({
    where: {
      otp:otp,
      mobileNumber: mobileNumber,
    },
  });
  let nullOtpVerification = await Users.findOne({
    where:{
      mobileNumber:mobileNumber
    }
  })

  if (checkOtpVerification) {
    await Users.update(
      {
        otp: null,
      },
      {
        where: {
          otp: otp,
          mobileNumber: mobileNumber,
        },
      }
    );
    return res
      .status(200)
      .send({ status: true, message: "OTP verification successful." });
  } else if (nullOtpVerification.otp === null) {
    return res.status(400).send({ status:false,message: "OTP has expired." });
  } else {
    return res
      .status(200)
      .send({ status: false, message: "otp is incorrect." });
  }
};

module.exports = { createUser, loginUser, verifyOtp };
