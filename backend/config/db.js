const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure
  }
};

const getDB = () => {
  if (!client) {
    throw new Error("Database not connected");
  }
  return client.db(); // Returns the database instance
};

module.exports = { connectDB, getDB };
