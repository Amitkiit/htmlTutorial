const db = require("../models/mainModel");
const Questions = db.questions;

const createQuestion = async function (req, res) {
  try {
    let data = req.body;
    const {
      question_text,
      option1,
      option2,
      option3,
      option4,
      correct_option,
    } = data;
    if (!question_text)
      return res
        .status(200)
        .send({ status: false, message: "pls type the question_text" });
    if (!option1)
      return res
        .status(200)
        .send({ status: false, message: "pls type the option1" });
    if (!option2)
      return res
        .status(200)
        .send({ status: false, message: "pls type the option2" });
    if (!option3)
      return res
        .status(200)
        .send({ status: false, message: "pls type the option3" });
    if (!option4)
      return res
        .status(200)
        .send({ status: false, message: "pls type the option4" });
    if (!correct_option)
      return res
        .status(200)
        .send({ status: false, message: "pls type the correct_option" });
    let newQuestion = await Questions.create(data);
    res.status(201).send({
      status: true,
      message: "question create successfully",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//===========================get Question Api ==========================================//

const getQuestion = async function (req, res) {
  try {
    let getAllQuestion = await Questions.findAll({
      attributes: [
        "id",
        "question_text",
        "option1",
        "option2",
        "option3",
        "option4",
      ],
    });
    res.status(200).send({
      status: true,
      message: "pls see all the question",
      data: getAllQuestion,
    });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//=========================get question by the Id =======================================//
const getQuestionById = async function (req, res) {
  try {
    let { id } = req.query;
    if (id) {
      let findQuestion = await Questions.findOne({
        where: {
          id: id,
        },
        attributes: [
          "id",
          "question_text",
          "option1",
          "option2",
          "option3",
          "option4",
        ],
      });
      if (!findQuestion)
        return res
          .status(400)
          .send({ status: false, message: "question does not exist" });
      res.status(200).send({ status: false, data: findQuestion });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please remove extra keys" });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//==================submit the answer ===================================//
module.exports = { createQuestion, getQuestion, getQuestionById };
