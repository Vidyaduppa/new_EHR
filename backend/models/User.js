const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI; // Ensure this is set in your environment variables
const client = new MongoClient(uri);

const dbName = "test"; // Replace with your actual database name
const collectionName = "users";

async function connectDB() {
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Validation function
function validateUserData(user) {
  const errors = [];

  if (!user.first_name || user.first_name.length > 35) {
    errors.push("Invalid first name");
  }
  if (!user.last_name || user.last_name.length > 35) {
    errors.push("Invalid last name");
  }
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push("Invalid email format");
  }
  if (!user.password || user.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return errors.length > 0 ? errors : null;
}

// Create a new user
async function createUser(userData) {
  const collection = await connectDB();
  const errors = validateUserData(userData);

  if (errors) {
    return { success: false, errors };
  }

  userData.createdDate = new Date();
  userData.updatedDate = new Date();

  try {
    const result = await collection.insertOne(userData);
    return { success: true, userId: result.insertedId };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    throw error;
  }
}

// Get all users with pagination
async function getUsers(query = {}, page = 1, limit = 10) {
  const collection = await connectDB();
  const skip = (page - 1) * limit;

  const users = await collection.find(query).skip(skip).limit(limit).toArray();
  const total = await collection.countDocuments(query);

  return { success: true, data: users, total };
}

// Get a user by ID
async function getUserById(userId) {
  const collection = await connectDB();

  const user = await collection.findOne({ _id: new ObjectId(userId) });
  return user ? { success: true, data: user } : { success: false, message: "User not found" };
}

// Update a user
async function updateUser(userId, updateData) {
  const collection = await connectDB();
  
  updateData.updatedDate = new Date();
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updateData }
  );

  return result.matchedCount > 0
    ? { success: true, message: "User updated successfully" }
    : { success: false, message: "User not found" };
}

// Delete a user
async function deleteUser(userId) {
  const collection = await connectDB();

  const result = await collection.deleteOne({ _id: new ObjectId(userId) });
  return result.deletedCount > 0
    ? { success: true, message: "User deleted successfully" }
    : { success: false, message: "User not found" };
}

// Set a password reset token
async function setPasswordResetToken(userId, token, expiration) {
  const collection = await connectDB();
  
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { resetToken: token, resetTokenExpiration: expiration, updatedDate: new Date() } }
  );

  return result.matchedCount > 0
    ? { success: true, message: "Reset token set successfully" }
    : { success: false, message: "User not found" };
}

// Verify a password reset token
async function verifyResetToken(email, token) {
  const collection = await connectDB();
  const currentTimestamp = Date.now();

  const user = await collection.findOne({
    email,
    resetToken: token,
    resetTokenExpiration: { $gt: currentTimestamp },
  });

  return user
    ? { success: true, message: "Valid reset token" }
    : { success: false, message: "Invalid or expired reset token" };
}

// Clear the reset token after password reset
async function clearResetToken(userId) {
  const collection = await connectDB();
  
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $unset: { resetToken: "", resetTokenExpiration: "" }, $set: { updatedDate: new Date() } }
  );

  return result.matchedCount > 0
    ? { success: true, message: "Reset token cleared successfully" }
    : { success: false, message: "User not found" };
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  setPasswordResetToken,
  verifyResetToken,
  clearResetToken,
};
