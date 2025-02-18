const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
 
// Import Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors(
 
));
app.use(bodyParser.json());
 
// Connect to MongoDB
mongoose
  .connect("mongodb+srv://user:user123@cluster0.9ilu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
 
// Routes Middleware
app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes); // Patients routes
 
// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
 
 
app.post('/api/patients/register', async (req, res) => {
  console.log('Received patient data:', req.body);
  const patientData = req.body;
  const newPatient = new Patient(patientData);
  await newPatient.save();
  // Here you would typically save `patientData` to your database
  console.log('Received patient data:', patientData);
  res.status(200).json({ message: 'Patient registered successfully!' });
  }
);

 
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});