//Server initilization
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Establishing template view engine
app.set("view engine", "ejs");

// Server middleware

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Local database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Helper functions

function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Routes

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars)
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {  
const templateVars = { 
  shortURL: req.params.shortURL, 
  longURL: urlDatabase[req.params.shortURL.trim()],
  }
console.log(req.params.shortURL.length, templateVars.shortURL)
  res.render("urls_show", templateVars)
})

// *******************************************************

app.post("/urls", (req, res) => {
  const id = generateRandomString()
  urlDatabase[id] = req.body.longURL
  res.redirect("/urls");

})


// Server listening event

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

