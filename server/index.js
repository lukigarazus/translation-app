const fetch = require("node-fetch");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const getBody = (details) => {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
};

const fetchTranslation = async (text, langs) => {
  console.log(langs);
  const details = {
    sl: langs.source,
    tl: langs.target,
    q: text,
  };
  const res = await (
    await fetch(
      "https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=%25s&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e&",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1",
        },
        body: getBody(details),
      }
    )
  ).json();
  return res.sentences.map((s) => s.trans).join("");
};

// fetchTranslation("Ich bin da. Er ist nich da.");

const cache = {};

app.post("/translate", async (req, res) => {
  if (cache[req.body.text]) res.send({ translation: cache[req.body.text] });
  else {
    const translation = await fetchTranslation(req.body.text, req.body.langs);
    res.send({ translation });
  }
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
