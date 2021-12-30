const express = require('express');
const router = express.Router();
const fs = require('fs');
const { QuizClient, Quiz } = require("@vox-logic/quizgen");
const { default: axios } = require('axios');

const quizzes = new QuizClient(
  "19fddbb1e80c74f77991222a36202c47dc54fdf2a91de57e8d2bfbe70b5d4c7a"
);
/* GET home page. */

router.get("/get-quiz", async (req, res) => {
  if(fs.existsSync('./quiz/quiz.json')) {
    let quiz = JSON.parse(fs.readFileSync('quiz/quiz.json',{encoding:'utf8', flag:'r'})).quiz.questions;
  alexaResponse = {
    questions: [],
    answers: [],
    options: []
  };
  for(let i = 0; i < quiz.length; i++) {
    alexaResponse.questions.push(quiz[i]["question"]);
    if (quiz[i]["distractors"].length == 4) {
      let array = quiz[i]["distractors"]
      array.splice(array.indexOf(quiz[i]["answer"]), 1);
      array.splice(Math.floor(Math.random() * array.length), 1);
      array.splice(Math.floor(Math.random() * array.length + 1), 0, quiz[i]["answer"]);
    }
    alexaResponse.answers.push(quiz[i]["answer"]);
    alexaResponse.options.push(quiz[i]["distractors"]);
  }
  }
  else {
  }
  let currentIndex = alexaResponse.questions.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [alexaResponse.questions[currentIndex], alexaResponse.questions[randomIndex]] = [
      alexaResponse.questions[randomIndex], alexaResponse.questions[currentIndex]];
      [alexaResponse.answers[currentIndex], alexaResponse.answers[randomIndex]] = [
        alexaResponse.answers[randomIndex], alexaResponse.answers[currentIndex]];
        [alexaResponse.options[currentIndex], alexaResponse.options[randomIndex]] = [
          alexaResponse.options[randomIndex], alexaResponse.options[currentIndex]];
  }
  res.status(200).json({ ok: "true", quiz: alexaResponse });
});

router.post("/completed-quiz", async (req, res) => {
  if (req.body.challenge) return res.sendStatus(200);
  if (!req.body.ok) {
    console.log(`Our quiz wasn't generated because\n${req.body.reason}`);
    res.status(400).json(req.body);
    return;
  }
  const quiz = req.body.quiz;
  console.log(JSON.stringify({ quiz }));
  fs.writeFileSync('./quiz/quiz.json', JSON.stringify({ quiz }));
  axios.post('https://api.notifymyecho.com/v1/NotifyMe',  {
    notification: "Your quiz is ready!",
    accessCode: "amzn1.ask.account.AGDZCGE7QBCQY3UZ4E2LU4YGSCWDC5DJEMDFCHCSF3GWZTSGE26VRFYCOCEAH6NKOTCCGSGBC7V7IAJHTHQI6Y7W7Q2J5IAQ7NW42XVH7RTDSHK5ZPUAFWQSTS2CZYTCWU7XLAVM3B5I7PQWAEI2ZEIDIWSFU7LZAZFK6ILJURUW2NV3BBIFCLYPDJ4HYYWND563HEBIDT64ENI"
  })
  res.sendStatus(200);
});

router.get('/notify-alexa', (req, res) => {
  axios.post('https://api.notifymyecho.com/v1/NotifyMe',  {
    notification: req.body.notification,
    accessCode: "amzn1.ask.account.AGDZCGE7QBCQY3UZ4E2LU4YGSCWDC5DJEMDFCHCSF3GWZTSGE26VRFYCOCEAH6NKOTCCGSGBC7V7IAJHTHQI6Y7W7Q2J5IAQ7NW42XVH7RTDSHK5ZPUAFWQSTS2CZYTCWU7XLAVM3B5I7PQWAEI2ZEIDIWSFU7LZAZFK6ILJURUW2NV3BBIFCLYPDJ4HYYWND563HEBIDT64ENI"
  })
  res.status(200).json({ success: true })
})

router.post('/generate-quiz', async (req, res, next) => {
  // const quiz = JSON.parse(fs.readFileSync('src/data/sample-response.json',{encoding:'utf8', flag:'r'}));
  // alexaResponse = [];
  // for(let i = 0; i < quiz.length; i++) {
  //   for (let j = 0; j < quiz[i].length; j++) {
  //     qa = {
  //       question: quiz[i][j]["question"],
  //       answer: quiz[i][j]["answer"]
  //     }
  //     alexaResponse.push(qa)
  //   }
  // }
  // res.status(200).json({ quiz: alexaResponse })
  console.log(req.body.topic)
  axios.post('http://localhost:8002/generate-quiz', { url: "https://brainly.in/question/8564024" })
  res.status(200).json({ success: true })
});

module.exports = router;
