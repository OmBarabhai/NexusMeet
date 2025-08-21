import httpStatus from "http-status";
import { User } from "../models/user.model.js"; // Note: Add .js for ES Modules
import bcrypt from "bcrypt";
import crypto from "crypto"; // This is needed to generate a token

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) { // 1. Corrected '|| password' to '|| !password'
    return res.status(400).json({ message: "Please Provide Username and Password" });
  }

  try {
    const user = await User.findOne({ username }); // 2. Changed 'find' to 'findOne'
    if (!user) { // 3. This check now works correctly with findOne()
      return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
    }

    // 4. Added 'await' to bcrypt.compare
    if (await bcrypt.compare(password, user.password)) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      // 5. Added an 'else' block for failed password comparison
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    // 6. Improved error message
    return res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 7. Changed status from FOUND (302) to CONFLICT (409)
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword // 8. Corrected the variable name
    });
    await newUser.save();

    // 9. Corrected the typo 'http.Status' to 'httpStatus'
    return res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    // 10. Added a 500 status code for server errors
    return res.status(500).json({ message: `Something went to wrong: ${e.message}` });
  }
};
export { login, register };
