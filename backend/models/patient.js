const mongoose = require("mongoose");
 
const patientSchema = new mongoose.Schema({
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
  status: { type: Boolean, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});
 
// Pre-save middleware to ensure the validation is called on `save()`
patientSchema.pre('save', function(next) {
  // Compare the Date of Birth with the current date
  const today = new Date();
  if (this.dob > today) {
    return next(new Error("Date of Birth cannot be in the future."));
  }
  next();
});
 
module.exports = mongoose.model("Patient", patientSchema);