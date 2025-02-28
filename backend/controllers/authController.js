const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/emailService");
const { ObjectId } = require("mongodb");

// Controller to fetch all users
exports.getUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).toArray();

    // Map users to include only the fields needed (id, first_name, last_name)
    const userList = users.map((user) => ({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user._id.toString(),  // Assuming MongoDB's ObjectId type
    }));

    res.status(200).json({ success: true, data: userList });

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const db = getDB();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      createdDate: new Date(), // Add created timestamp
      updatedDate: new Date(), // Add updated timestamp
    };

    await db.collection("users").insertOne(newUser);
   // Respond with success and the new user details (excluding password)
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        first_name,
        last_name,
        email,
      }
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const db = getDB();
//     const user = await db.collection("users").findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ message: "Login successful", token });

//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Fix: Include user email in response
    res.json({
      message: "Login successful",
      token,
      user: {
        email: user.email // Make sure this matches what Angular expects
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) return res.sendStatus(200); // Prevent email enumeration

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await db.collection("users").updateOne(
      { email },
      { $set: { resetToken: token, resetTokenExpiration: Date.now() + 3600000 } } // 1 hour
    );

    sendResetEmail(email, token);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiration: "" } }
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
