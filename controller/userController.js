const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const Users = require("../models/userModel");
const Request = require("../models/requestModal");

const userController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, bloodGrp, pincode, password, email } =
        req.body;
      const user = await Users.findOne({
        email,
      });
      if (user)
        return res.status(400).json({
          msg: "email already registered",
        });
      if (password.length < 6)
        return res.status(400).json({
          msg: "password length less than 6 ",
        });

      //   password encryption

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({
        firstName,
        lastName,
        bloodGrp,
        pincode,
        email,
        password: hashPassword,
      });
      // save to mongo
      await newUser.save();

      // create json web token
      const accessToken = createAccessToken({
        id: newUser._id,
      });

      const refreshToken = createRefreshToken({
        id: newUser._id,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshToken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      // registration success
      res.status(200).json({
        msg: "registration successful",
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const rft = req.cookies.refreshToken;

      if (!rft)
        return res.status(400).json({
          msg: "plz login or register",
        });

      jwt.verify(rft, process.env.REFRESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({
            msg: "plz login or register",
          });

        const accessToken = createAccessToken({
          id: user.id,
        });

        res.json({
          accessToken: accessToken,
        });
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json("user not there ");
      const flag = await bcrypt.compare(password, user.password) ; 
      
      if (!flag)
        return res.status(400).json("password in wrong ");

      // create accessToken

      const accessToken = createAccessToken({
        id: user._id,
      });
      const refreshToken = createRefreshToken({
        id: user._id,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshToken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json({
        accessToken: accessToken,
      });
      // res.send("login suucessful");
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refreshToken" });
      return res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json("User not found");

      res.json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  history: async (req, res) => {
    const user = await Users.findById(req.user.id)
      .populate({
        path: "requests",
        populate: {
          path: "donor_id",
        },
      })
      .populate({
        path: "donates",
        populate: {
          path: "user_id",
        },
      })
      .exec();
    const requestedBlood = user.requests;
    const donatedBlood = user.donates;
    res.status(200).send({
      requestArr: requestedBlood,
      donatesArr: donatedBlood,
    });
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "11m",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

module.exports = userController;
