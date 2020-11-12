//Server initilization
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Establishing template view engine
app.set("view engine", "ejs");

// Establishing enryption

const bcrypt = require('bcrypt')

// Server middleware

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Local database
// const urlDatabase = {
//   "b2xVn2": "www.lighthouselabs.ca",
//   "9sm5xK": "www.google.com"
// };
const urlDatabase = {
  sgq3y6: { longURL: "www.google.ca", id: "userRandomID" },
  b6UTxQ: { longURL: "www.tsn.ca", id: "user2RandomID" }
};

const users = {

  "userRandomID": {
    id: "userRandomID",
    email: "1@1.com",
    password: "1"
  },

  "user2RandomID": {
    id: "user2RandomID",
    email: "12@12.com",
    password: "12"
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

const checkUser = (email, password) => {
  if(email === "" || password === ""){
    return { error: "Please fill email and/or password"}
  } 
  for (let user in users) {
    if (users[user].email === email && users[user].password === password) {
      return users[user].id 
    } 
  }
   return { error: "Username or Password is incorrect"};
}

const generateUser = (id, email, password) => {
  return users[id] = {
    id,
    email,
    password
  }
}

const urlsForUser = (id) => {
  let userURL = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].id === id) {
      userURL[key] = urlDatabase[key].longURL;
    }
  }
  return userURL;
}

const generateURL = (id, website, userID) => {
  return urlDatabase[id] = { 
    "longURL": website, 
    "id": userID }
};





// Routes

app.get("/urls", (req, res) => {
  let key = req.cookies["user_id"]
  let userUrls = urlsForUser(key)
  console.log("userUrls", userUrls, "URLdatabase", urlDatabase)
  const templateVars = { 
  urls: userUrls,
  user_id: users[key]
}
// console.log("urlDatabase", urlDatabase)
res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  let key = req.cookies["user_id"]
  if(key === undefined){
    res.redirect("/login")
  }
  const templateVars = {
  user_id: users[key]
  }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user_id: false
  
    }
  res.render("urls_register", templateVars );
})

app.get("/login", (req, res) => {
  const templateVars = {
    user_id: false
  
    }
  res.render("urls_login", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {  
let key = req.cookies["user_id"]

if(key !== urlDatabase[req.params.shortURL.trim()].id){
  res.status(403).redirect("/urls")
  // return setTimeout(res.redirect("/urls"), 5000)
} else {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL.trim()].longURL,
    user_id: users[key]
    }
    res.render("urls_show", templateVars)

}
console.log(urlDatabase[req.params.shortURL.trim()])
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL.trim()].longURL
  // console.log(longURL)
  if (longURL){
    res.redirect(`http://${longURL}`);
  } else {
    res.status(404).send("Error URL not found")
  }
  // console.log(longURL)
});

// *******************************************************

app.post("/urls", (req, res) => {
  const website = req.body.longURL;
  const userID = req.cookies["user_id"];
  const id = generateRandomString()
  generateURL(id, website, userID)
  res.redirect(`/urls/${id}`);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.cookies["user_id"]
  if(key !== urlDatabase[req.params.shortURL.trim()].id){
    res.status(403).send("This does not belong to you")
   } else {
      delete urlDatabase[req.params.shortURL]
      res.redirect("/urls")

    }
  // console.log(req.params.shortURL)
})

app.post("/urls/:shortURL", (req, res) => {
  const key = req.cookies["user_id"]
  if(key !== urlDatabase[req.params.shortURL.trim()].id){
    res.status(403).send("This does not belong to you")
    
   } else {
  urlDatabase[req.params.shortURL.trim()].longURL = req.body.longURL;
  // console.log(urlDatabase[req.params.shortURL.trim()])
  res.redirect("/urls")
   }
})

app.post("/login", (req, res) => {
  const {email, password } = req.body;
  // console.log(email, password)
  const id = checkUser(email, password)
  // console.log(id.email)
  if (typeof id === "object"){
    return res.status(403).send(id.error)
  } else {
    res.cookie("user_id", id)
    res.redirect("/urls")
  }
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

