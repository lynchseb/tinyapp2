const bcrypt = require('bcrypt');

const getPassword = (email, users) => {
  for (let user in users) {
    if (users[user].email === email) {
      return { hashedPassword: users[user].hashedPassword, id: users[user].id };
    }
  }
};

const checkUser = (email, password, users) => {
  if (email === "" || password === "") {
    return { error: "Please fill email and/or password"};
  }
  const hashPass = getPassword(email, users);

  if (bcrypt.compareSync(password, hashPass.hashedPassword) === true) {
    return hashPass.id;
  }
  return { error: "Username or Password is incorrect"};
};

const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const checkRegistration = (email, password, users) => {
  if (email === "" || password === "") {
    return { error: "Please fill email and/or password"};
  }
  for (let user in users) {
    if (users[user].email === email) {
      return { error: "Email already in use" };
    }
  }
  return true;
};

const generateUser = (id, email, hashedPassword, users) => {
  return users[id] = {
    id,
    email,
    hashedPassword
  };
};

const urlsForUser = (id, urlDatabase) => {
  let userURL = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].id === id) {
      userURL[key] = urlDatabase[key].longURL;
    } else {
      userURL[key] = "For British Eyes Only!";
    }
  }
  return userURL;
};

const generateURL = (id, website, userID, urlDatabase) => {
  return urlDatabase[id] = {
    "longURL": website,
    "id": userID };
};

module.exports = { checkUser, generateRandomString, checkRegistration, generateUser, urlsForUser, generateURL }