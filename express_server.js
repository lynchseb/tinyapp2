//Server initilization
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Establishing template view engine
app.set("view engine", "ejs");

// Server middleware

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Local database
const urlDatabase = {
  "b2xVn2": "www.lighthouselabs.ca",
  "9sm5xK": "www.google.com"
};

const users = {

  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },

  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

}

// Helper functions

const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const checkRegistration = (email, password) => {
  if(email === "" || password === ""){
    return { error: "Please fill email and/or password"}
  } 
  for (let user in users) {
    if (users[user].email === email) {
      return { error: "Email already in use" }
    }
  }
  return true
}

const generateUser = (id, email, password) => {
  return users[id] = {
    id,
    email,
    password
  }
}




// Routes

app.get("/", (req, res) => {
  let key = req.cookies["user_id"]
  const templateVars = { 
    urls: urlDatabase,
    user_id: users[key]
  }
  res.render("urls_index", templateVars)
});

app.get("/urls", (req, res) => {
  let key = req.cookies["user_id"]
  const templateVars = { 
  urls: urlDatabase,
  user_id: users[key]
}
res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  let key = req.cookies["user_id"]
  const templateVars = {
  user_id: users[key]

  }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
})

app.get("/urls/:shortURL", (req, res) => {  
let key = req.cookies["user_id"]
const templateVars = { 
  shortURL: req.params.shortURL, 
  longURL: urlDatabase[req.params.shortURL.trim()],
  user_id: users[key]
  }
// console.log(req.params.shortURL.length, templateVars.longURL)
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL.trim()]
  if (longURL){
    res.redirect(`http://${longURL}`);
  } else {
    res.status(404).send("Error URL not found")
  }
  // console.log(longURL)
});

// *******************************************************

app.post("/urls", (req, res) => {
  const id = generateRandomString()
  urlDatabase[id] = req.body.longURL
  res.redirect(`/urls/${id}`);

})

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL)
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL.trim()] = req.body.longURL;
  // console.log(urlDatabase[req.params.shortURL], req.params.shortURL)
  // console.log(urlDatabase[req.params.shortURL])
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  res.cookie('user_id', req.body.username)
  res.redirect("/urls")
  // console.log(username)
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.post("/register", (req, res) => {
  const {email, password} = req.body
  const id = generateRandomString();
  const result = checkRegistration(email, password)
  if(typeof result === "object" ){
    return res.status(400).send(result.error)
  } else {
    generateUser(id, email, password)
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
})


// Server listening event

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

