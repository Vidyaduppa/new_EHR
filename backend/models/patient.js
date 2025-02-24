const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI; // Ensure this is set in your environment variables
const client = new MongoClient(uri);

const dbName = "test"; // Replace with your database name
const collectionName = "patients";

async function connectDB() {
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Validation function
function validatePatientData(patient) {
  const errors = [];

  if (!patient.first_name || !/^[A-Za-z]+$/.test(patient.first_name) || patient.first_name.length > 35) {
    errors.push("Invalid first name");
  }
  if (!patient.last_name || !/^[A-Za-z]+$/.test(patient.last_name) || patient.last_name.length > 35) {
    errors.push("Invalid last name");
  }
  if (!patient.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
    errors.push("Invalid email format");
  }
  if (!patient.mobile_phone || patient.mobile_phone.length !== 10) {
    errors.push("Mobile phone must be exactly 10 digits");
  }
  if (!patient.address_line_1 || patient.address_line_1.length > 40) {
    errors.push("Invalid address line 1");
  }
  if (patient.address_line_2 && patient.address_line_2.length > 100) {
    errors.push("Invalid address line 2");
  }
  if (!patient.city || patient.city.length > 35) {
    errors.push("Invalid city");
  }
  if (!patient.state || patient.state.length > 20) {
    errors.push("Invalid state");
  }
  if (!patient.zipcode || !/^\d{5}(-\d{4})?$/.test(patient.zipcode)) {
    errors.push("Invalid zipcode format");
  }
  if (!patient.dob || new Date(patient.dob) > new Date()) {
    errors.push("Date of birth cannot be in the future");
  }
  if (!["male", "female", "other"].includes(patient.gender)) {
    errors.push("Invalid gender");
  }
  
  return errors.length > 0 ? errors : null;
}

// Insert a new patient
async function createPatient(patientData) {
  const collection = await connectDB();
  const errors = validatePatientData(patientData);

  if (errors) {
    return { success: false, errors };
  }

  patientData.createdDate = new Date();
  patientData.updatedDate = new Date();
  patientData.deleted = false;

  const result = await collection.insertOne(patientData);
  return { success: true, patientId: result.insertedId };
}

// Get all patients with optional filters
async function getPatients(query = {}, page = 1, limit = 10) {
  const collection = await connectDB();
  
  const filters = { deleted: false, ...query };
  const skip = (page - 1) * limit;
  
  const patients = await collection.find(filters).skip(skip).limit(limit).toArray();
  const total = await collection.countDocuments(filters);
  
  return { success: true, data: patients, total };
}

// Get a single patient by ID
async function getPatientById(patientId) {
  const collection = await connectDB();
  
  const patient = await collection.findOne({ _id: new ObjectId(patientId), deleted: false });
  return patient ? { success: true, data: patient } : { success: false, message: "Patient not found" };
}

// Update a patient
async function updatePatient(patientId, updateData) {
  const collection = await connectDB();
  
  updateData.updatedDate = new Date();
  const result = await collection.updateOne(
    { _id: new ObjectId(patientId), deleted: false },
    { $set: updateData }
  );

  return result.matchedCount > 0
    ? { success: true, message: "Patient updated successfully" }
    : { success: false, message: "Patient not found or already deleted" };
}

// Soft delete a patient
async function softDeletePatient(patientId) {
  const collection = await connectDB();
  
  const result = await collection.updateOne(
    { _id: new ObjectId(patientId) },
    { $set: { deleted: true, updatedDate: new Date() } }
  );

  return result.matchedCount > 0
    ? { success: true, message: "Patient soft-deleted" }
    : { success: false, message: "Patient not found" };
}

// Restore a soft-deleted patient
async function restorePatient(patientId) {
  const collection = await connectDB();
  
  const result = await collection.updateOne(
    { _id: new ObjectId(patientId), deleted: true },
    { $set: { deleted: false, updatedDate: new Date() } }
  );

  return result.matchedCount > 0
    ? { success: true, message: "Patient restored successfully" }
    : { success: false, message: "Patient not found or not deleted" };
}

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
  restorePatient,
};
