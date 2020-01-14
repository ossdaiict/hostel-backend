const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const {
  sendConfirmationMail,
  sendPasswordResetMail
} = require("../../utils/mailSender");

const saltRounds = 10;

const signIn = (req, res) => {
  User.findOne({ sID: req.body.sID })
    .select("-__v -_id")
    .exec((error, user) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Database query Failed!.." });
      } else if (user === null)
        return res.status(404).json({ message: "User does not exist!.." });
      else if (user.isHMCVerified === false)
        return res
          .status(500)
          .json({ message: "Email Confirmation Pending...." });
      else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Auth failed!.." });
          }
          if (result) {
            const { sID, isSupervisor, wing, name, room } = user;
            const token = jwt.sign(
              {
                sID,
                isSupervisor
              },
              process.env.SECRET_KEY,
              { expiresIn: "5h" }
            );
            return res.status(201).json({
              message: "Successful Authentication.",
              token,
              user: {
                sID,
                name,
                wing,
                room,
                isSupervisor
              }
            });
          } else res.status(500).json({ message: "Incorrect Password!.." });
        });
      }
    });
};

const HMCVerification = (req, res) => {
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { sID } = user;
  User.update({ sID }, { isHMCVerified: true }, err => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error. Could not verify user!.." });
    } else res.redirect(process.env.LOGIN_PAGE);
  });
};

const signUp = (req, res) => {
  const { sID, password, fname, lname, wing, room } = req.body;
  User.findOne({ sID }).exec((error, user) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Database query Failed!.." });
    } else if (user === null) {
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, (err, hash) => {
          User.create(
            {
              sID,
              room,
              wing: wing.toUpperCase(),
              name: fname + " " + lname,
              password: hash
            },
            error => {
              if (error) {
                return res.status(500).json({
                  message: "Database error.Failed to create a user!.."
                });
              } else {
                sendConfirmationMail(sID);
                return res
                  .status(201)
                  .json({ message: "New user created Successfully." });
              }
            }
          );
        });
      });
    } else {
      return res.status(500).json({ message: "User is already exist!.." });
    }
  });
};

const sendPasswordResetLink = (req, res) => {
  const { sID } = req.body;
  User.findOne({ sID })
    .then(data => {
      if (data) {
        sendPasswordResetMail(sID);
        return res.status(201).json({ message: "Plaese check your email!." });
      } else {
        throw new Error();
      }
    })
    .catch(err => {
      return res.status(500).json({ message: "User is not exist!..." });
    });
};

const resetPassword = (req, res) => {
  const { password } = req.body;
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { sID } = user;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      User.findOneAndUpdate({ sID }, { password: hash })
        .then(user => {
          res
            .status(201)
            .json({ message: "Password is changed Successfully." });
        })
        .catch(err => {
          res.status(500).json({ message: "Password is not changed!.." });
        });
    });
  });
};

const router = express.Router();

router.get("/:token", HMCVerification);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/reset-password", sendPasswordResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
