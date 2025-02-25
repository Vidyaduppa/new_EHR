const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const patientSchema = {
  _id: ObjectId,
  first_name: {
    type: String,
    required: true,
    maxlength: 35,
    match: /^[A-Za-z]/,
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 35,
    match: /^[A-Za-z]/,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  mobile_phone: {
    type: String,
    required: true,
    maxlength: 10,
  },
  address_line_1: { type: String, required: true, maxlength: 40 },
  address_line_2: { type: String, maxlength: 100 },
  city: { type: String, required: true, maxlength: 35 },
  state: { type: String, required: true, maxlength: 20 },
  zipcode: {
    type: String,
    required: true,
    match: /^\d{5}(-\d{4})?$/,
  },
  country: { type: String, default: "US" },
  notes: { type: String },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  allowShare: { type: Boolean, default: false },
   /** STATUS FIELD UPDATED FOR SOFT DELETION */
   status: { type: Number, enum: [0, 1, 2], required: true, default: 1 }, 
  createdDate: { type: Date, default: new Date() },
  updatedDate: { type: Date, default: new Date() },
};

// Function to validate DOB before inserting
const validateDOB = (patient) => {
  const today = new Date();
  if (patient.dob > today) {
    throw new Error("Date of Birth cannot be in the future.");
  }
};

// Function to insert a new patient
const insertPatient = async (patientData) => {
  const db = getDB();
  validateDOB(patientData);
  patientData.createdDate = new Date();
  patientData.updatedDate = new Date();
  return await db.collection("patients").insertOne(patientData);
};

// Function to update a patient
const updatePatient = async (id, patientData) => {
  const db = getDB();
  validateDOB(patientData);
  patientData.updatedDate = new Date();
  return await db.collection("patients").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: patientData },
    { returnDocument: "after" }
  );
};

module.exports = { patientSchema, insertPatient, updatePatient };
