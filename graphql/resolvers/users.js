const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    const isUserExists = await User.findOne({
      email: args.userInput.email,
    });
    if (isUserExists) return new Error("User already exists.");

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    } catch (passwordErr) {
      throw passwordErr;
    }
    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });

    try {
      const newUser = await user.save();
      return { ...newUser._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async (args) => {
    const user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isEqual = await bcrypt.compare(args.password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "atopsecretkey",
      { expiresIn: "1h" }
    );
    return { userId: user.id, token, tokenExpiration: 1 };
  },
};
