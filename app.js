
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const User = require("./models/user");
const app = express();
// import bodyParser from "body-parser";
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const bodyParser = require("body-parser");

app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.get("/", (req, res) => {
    res.send("Welcome to the API");
}
);

//get list of questions
app.get("/api/questions", auth, (req, res) => {
}
);
//post reponses to questions
app.post("/api/questions", auth, (req, res) => {
 
}
);


// Register
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
        console.log('req', req.body
        
        )
        return res.status(409).send("Required fileds are missing");
    }
    //check email string is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).send("Invalid email");
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword
        });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    newUser.token = token;

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
  }
});
    
    // Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
       const  user =  await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).send("Invalid Credentials");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Credentials");
        }
        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;
        res.status(200).json(user);

    } catch (err) {
    console.log(err);
    }
});

module.exports = app;