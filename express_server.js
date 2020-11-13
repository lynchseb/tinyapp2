//Server initilization
const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { checkUser, generateRandomString, checkRegistration, generateUser, urlsForUser, generateURL } = require('./helpers');

const PORT = 8080; // default port 8080

// Establishing template view engine
app.set("view engine", "ejs");

// Server middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  secret: "superSecret",

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Local Databases
const urlDatabase = {
  sgq3y6: { longURL: "www.google.ca", id: "userRandomID" },
  b6UTxQ: { longURL: "www.tsn.ca", id: "user2RandomID" },
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "1@1.com",
    hashedPassword: bcrypt.hashSync("1", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "12@12.com",
    hashedPassword: bcrypt.hashSync("12", 10)
  }
};

// Get Routes
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let key = req.session.user_id;
  let userUrls = urlsForUser(key, urlDatabase);
  const templateVars = {
    urls: userUrls,
    user_id: users[key]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let key = req.session.user_id;
  if (key === undefined) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user_id: users[key]
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id !== undefined) {
    res.redirect('/urls');
  }
  const templateVars = {
    user_id: false
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  if (req.session.user_id !== undefined) {
    res.redirect('/urls');
  }
  const templateVars = {
    user_id: false
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let key = req.session.user_id;
  if (key === undefined) {
    res.status(401).send("No admittance except on Login business!");
  }
  if (urlDatabase[req.params.shortURL.trim()] === undefined) {
    res.status(404).send("This link is having an existential crisis");
  } else if (key !== urlDatabase[req.params.shortURL.trim()].id) {
    res.status(403).send("You have no power here Gandalf Greyhame!");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL.trim()].longURL,
      user_id: users[key]
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL.trim()] === undefined) {
    res.status(404).send("Don't go where I can't follow");
  }
  const longURL = urlDatabase[req.params.shortURL.trim()].longURL;
  if (longURL) {
    res.redirect(`http://${longURL}`);
  } else {
    res.status(404).send("I have no memory of this place");
  }
});

// Post Routes

app.post("/urls", (req, res) => {
  const website = req.body.longURL;
  const userID = req.session.user_id;
  const id = generateRandomString();
  generateURL(id, website, userID, urlDatabase);
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const key = req.session.user_id;
  if (req.params.shortURL === "For British") {
    res.status(403).send("No mere man can delete me!");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
}
);

app.post("/urls/:shortURL", (req, res) => {
  const key = req.session.user_id;
  if (key !== urlDatabase[req.params.shortURL.trim()].id) {
    res.status(403).send("You shall not pass!");
  } else {
    urlDatabase[req.params.shortURL.trim()].longURL = req.body.longURL;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const {email, password } = req.body;
  // console.log(email, password)
  const id = checkUser(email, password, users);
  // console.log(id.email)
  if (typeof id === "object") {
    return res.status(403).send(id.error);
  } else {
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  const id = generateRandomString();
  const result = checkRegistration(email, password, users);
  if (typeof result === "object") {
    return res.status(400).send(result.error);
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    generateUser(id, email, hashedPassword, users);
    req.session.user_id = id;
    res.redirect("/urls");
  }
});


// Server listening event

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



