const Patient = require("../models/patient");

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);

    // Validate the patient data before saving
    const error = patient.validateSync();
    if (error) {
      return res.status(400).json({
        success: false,
        error: { message: "Validation error", details: error.errors },
      });
    }

    await patient.save();
    res.status(201).json({ success: true, data: patient, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

// // Get all patients with pagination, search, and filters
// exports.getPatients = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, state, status } = req.query;
//     const query = {};

//     // Search filter: First Name or Last Name
//     if (search) {
//       query.$or = [
//         { first_name: new RegExp(search, "i") },
//         { last_name: new RegExp(search, "i") },
//       ];
//     }

//     // State filter
//     if (state) query.state = state;

//     // Status filter (True or False)
//     if (status) query.status = status === "true";

//     // Fetch patients with pagination and filters
//     const patients = await Patient.find(query)
//       .limit(parseInt(limit)) // Ensure the limit is an integer
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .exec();

//     // Count total documents matching the query
//     const count = await Patient.countDocuments(query);

//     // Respond with data and pagination info
//     res.status(200).json({
//       success: true,
//       data: { patients, totalPages: Math.ceil(count / limit), currentPage: page },
//       error: null,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: { message: "Server error." } });
//   }
// };
exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, state, status } = req.query;
    const query = {};

    // Search filter: First Name or Last Name
    if (search) {
      query.$or = [
        { first_name: new RegExp(search, 'i') },
        { last_name: new RegExp(search, 'i') },
      ];
    }

    // State filter
    if (state) query.state = state;

    // Status filter (True or False)
    if (status !== undefined) query.status = status === 'true';

    // Calculate skip and limit for pagination
    const skip = (page - 1) * limit;
    const patients = await Patient.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .exec();

    // Count total documents matching the query
    const count = await Patient.countDocuments(query);

    // Respond with data and pagination info
    res.status(200).json({
      success: true,
      data: {
        patients,
        total: count, // Total number of records
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: 'Server error.' },
    });
  }
};


// Update a patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: patient, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

// Soft delete a patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndUpdate(id, { status: false });
    res.status(200).json({ success: true, data: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: { message: "Patient not found" },
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};