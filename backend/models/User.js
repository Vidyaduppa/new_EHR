// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   first_name: {
//     type: String,
//     required: true,
//     maxlength: 35,
//     match: /^[A-Za-z\s'-]+$/, // Allow spaces, hyphens, and apostrophes
//   },
//   last_name: {
//     type: String,
//     required: true,
//     maxlength: 35,
//     match: /^[A-Za-z\s'-]+$/, // Allow spaces, hyphens, and apostrophes
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8,
//     validate: {
//       validator: function (v) {
//         return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(v); // Password validation for at least one uppercase letter, one number, and one special character
//       },
//       message: "Password must contain at least one uppercase letter, one number, and one special character.",
//     },
//   },
//   createdDate: { 
//     type: Date, 
//     default: Date.now 
//   },
//   updatedDate: { 
//     type: Date, 
//     default: Date.now 
//   },
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
  
//   // Auto-update 'updatedDate' when a document is modified
//   if (this.isModified() && !this.isNew) {
//     this.updatedDate = Date.now();
//   }

//   next();
// });

// module.exports = mongoose.model("User", userSchema);
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// Function to create a new user
async function createUser(user) {
  const db = await connectDB();
  const collection = db.collection("users");

  // Validate user fields
  if (!user.first_name || !user.last_name || !user.email || !user.password) {
    throw new Error("All fields are required");
  }
  if (!/^[A-Za-z\s'-]+$/.test(user.first_name) || !/^[A-Za-z\s'-]+$/.test(user.last_name)) {
    throw new Error("Invalid name format");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error("Invalid email format");
  }
  if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(user.password)) {
    throw new Error("Password must contain at least one uppercase letter, one number, and one special character.");
  }

  // Check if user already exists
  const existingUser = await collection.findOne({ email: user.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password before storing
  user.password = await bcrypt.hash(user.password, 10);
  user.createdDate = new Date();
  user.updatedDate = new Date();

  const result = await collection.insertOne(user);
  return result;
}

// Function to update a user (modifies 'updatedDate' automatically)
async function updateUser(userId, updates) {
  const db = await connectDB();
  const collection = db.collection("users");

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  updates.updatedDate = new Date(); // Auto-update 'updatedDate'

  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updates }
  );

  return result;
}

// Function to find a user by email
async function findUserByEmail(email) {
  const db = await connectDB();
  const collection = db.collection("users");

  return await collection.findOne({ email });
}

module.exports = { createUser, updateUser, findUserByEmail };
