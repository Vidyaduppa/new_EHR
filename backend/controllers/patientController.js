const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.createPatient = async (req, res) => {
  try {
    const db = getDB();
    const patient = req.body;
    
    const result = await db.collection("patients").insertOne(patient);

    // Fetch the inserted document
    const insertedPatient = await db.collection("patients").findOne({ _id: result.insertedId });

    res.status(201).json({ success: true, data: insertedPatient, error: null });
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
    const db = getDB(); // Get database instance
    let { page = 1, limit = 10, search, state, status } = req.query;

    // Convert page & limit to integers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: { $ne: 2 } }; // Exclude soft deleted patients (status: 2)

    // Search filter: First Name or Last Name
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } }
      ];
    }

    // State filter
    if (state) query.state = state;

    // Status filter (0: Inactive, 1: Active)
    if (status !== undefined) query.status = parseInt(status);

    // Fetch patients with pagination and filters
    const patients = await db.collection("patients") // Fix this line
      .find(query)
      .sort({ _id: -1 })
      .skip(skip) // Apply skip
      .limit(limit) // Apply limit
      .toArray(); // Convert cursor to array

    // Count total matching patients
    const totalPatients = await db.collection("patients").countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        patients,
        totalPatients,
        totalPages: Math.ceil(totalPatients / limit),
        currentPage: page
      },
      error: null
    });

  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};


// exports.updatePatient = async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     const updateData = req.body;
    
//     const result = await db.collection("patients").findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: updateData },
//       { returnDocument: "after" }
//     );

//     res.status(200).json({ success: true, data: result.value, error: null });
//   } catch (err) {
//     res.status(500).json({ success: false, error: { message: "Server error." } });
//   }
// };

exports.updatePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let updateData = req.body;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId:", id);
      return res.status(400).json({ success: false, error: "Invalid patient ID" });
    }

    // 🚀 Remove `_id` if it's in the request body
    if (updateData._id) {
      delete updateData._id;
    }

    console.log("🔄 Updating patient:", id);
    console.log("📝 Update Data:", updateData);

    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      console.error("⚠️ Patient not found:", id);
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    console.log("✅ Update Success:", result.value);
    res.status(200).json({ success: true, data: result.value });

  } catch (err) {
    console.error("🔥 Error updating patient:", err);
    res.status(500).json({ success: false, error: err.message || "Server error." });
  }
};




exports.deletePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: false } }
    );

    if (!result.value) {
      return res.status(404).json({ success: false, error: { message: "Patient not found" } });
    }
    res.status(200).json({ success: true, data: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    // 🛑 Validate MongoDB ObjectId format
    if (!ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId:", id);
      return res.status(400).json({ success: false, error: { message: "Invalid patient ID format" } });
    }

    console.log("🔍 Searching for patient with ID:", id);

    const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });

    if (!patient) {
      console.warn("⚠️ Patient not found:", id);
      return res.status(404).json({ success: false, error: { message: "Patient not found" } });
    }

    console.log("✅ Patient found:", patient);
    res.status(200).json({ success: true, data: patient, error: null });

  } catch (err) {
    console.error("🔥 Error fetching patient:", err);
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

exports.restorePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: false } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ success: false, error: { message: "Patient not found" } });
    }
    res.status(200).json({ success: true, data: result.value, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};


// // Function to update a patient with assigned providers
// const updatePatientWithProviders = async (id, assignedProviders) => {
//   const db = getDB();

//   // Fetch the patient from the database
//   const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });

//   if (!patient) {
//     throw new Error('Patient not found');
//   }

//   // Update the patient with the new list of assigned providers
//   const updateResult = await db.collection("patients").findOneAndUpdate(
//     { _id: new ObjectId(id) },
//     { 
//       $push: { selectedProviders: { $each: assignedProviders } }  // Push selected providers
//     },
//     { returnDocument: "after" }
//   );

//   return updateResult.value;  // Return the updated patient
// };

// // Controller function to handle the route logic
// exports.assignProviders = async (req, res) => {
//   const assignedProviders = req.body.assignedProviders;  // Get the assigned providers from request body
//   const patientId = req.body.patientId;  // Get the patient ID

//   if (!assignedProviders || assignedProviders.length === 0) {
//     return res.status(400).json({ message: 'No providers selected' });
//   }

//   try {
//     const updatedPatient = await updatePatientWithProviders(patientId, assignedProviders);
//     res.status(200).json({ message: 'Providers assigned successfully', patient: updatedPatient });
//   } catch (error) {
//     console.error('Error assigning providers:', error);
//     res.status(500).json({ message: 'Error assigning providers' });
//   }
// };



// exports.registerPatient = async (req, res) => {
//   try {
//     const db = getDB();
//     console.log("Received patient data:", req.body);
//     const result = await db.collection("patients").insertOne(req.body);
//     res.status(200).json({ message: "Patient registered successfully!", patient: result.ops[0] });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering patient" });
//   }
// };

// exports.assignProviders = async (req, res) => {
//   const assignedProviders = req.body.assignedProviders;  // Get the assigned providers from request body
//   const patientId = req.body.patientId;  // Get the patient ID

//   console.log('Assigned Providers:', assignedProviders);
//   console.log('Patient ID:', patientId);

//   if (!assignedProviders || assignedProviders.length === 0) {
//     return res.status(400).json({ message: 'No providers selected' });
//   }

//   try {
//     const updatedPatient = await updatePatientWithProviders(patientId, assignedProviders);
//     res.status(200).json({ message: 'Providers assigned successfully', patient: updatedPatient });
//   } catch (error) {
//     console.error('Error assigning providers:', error);
//     res.status(500).json({ message: 'Error assigning providers' });
//   }
// };

// exports.assignProviders = async (req, res) => {
//   const assignedProviders = req.body.assignedProviders;  // Get the assigned providers from request body
//   const patientId = req.body.patientId;  // Get the patient ID

//   console.log('Assigned Providers:', assignedProviders);
//   console.log('Patient ID:', patientId);

//   if (!assignedProviders || assignedProviders.length === 0) {
//     return res.status(400).json({ message: 'No providers selected' });
//   }

//   try {
//     // Fetch the patient from the database
//     const patient = await db.collection("patients").findOne({ _id: new ObjectId(patientId) });

//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     // Push the provider details into the patient's selectedProviders array
//     const updateResult = await db.collection("patients").findOneAndUpdate(
//       { _id: new ObjectId(patientId) },
//       { 
//         $push: { selectedProviders: { $each: assignedProviders } }  // Push selected providers
//       },
//       { returnDocument: "after" }
//     );

//     // Return the updated patient with the assigned providers
//     res.status(200).json({ message: 'Providers assigned successfully', patient: updateResult.value });
//   } catch (error) {
//     console.error('Error assigning providers:', error);
//     res.status(500).json({ message: 'Error assigning providers' });
//   }
// };


exports.softDeletePatient = async (req, res) => {
  try {
    const db = getDB();
    const patientId = req.params.id;

    // Ensure valid ObjectId
    if (!ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    // Find and update patient status to `2` (Soft Delete)
    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(patientId) },
      { $set: { status: 2 } },
      { returnDocument: "after" } // Return updated document
    );

    // Fetch updated patient list after soft deletion
    const updatedPatients = await db.collection("patients")
      .find({ status: { $ne: 2 } }) // Exclude deleted patients
      .sort({ _id: -1 })
      .toArray();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Patient soft-deleted successfully",
      patient: result.value, // Return deleted patient
      patients: updatedPatients // Return updated list
    });

  } catch (error) {
    console.error("Soft Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error soft-deleting patient",
      error
    });
  }
};


exports.assignProviders = async (req, res) => {
  const assignedProviders = req.body.assignedProviders;  // Get the assigned providers from request body
  const patientId = req.body.patientId;  // Get the patient ID

  console.log('Assigned Providers:', assignedProviders);
  console.log('Patient ID:', patientId);

  if (!assignedProviders || assignedProviders.length === 0) {
    return res.status(400).json({ message: 'No providers selected' });
  }

  try {
    // Fetch the patient from the database
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(patientId) });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Push the provider details into the patient's selectedProviders array
    const updateResult = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(patientId) },
      { 
        $push: { selectedProviders: { $each: assignedProviders } }  // Push selected providers (including first_name and last_name)
      },
      { returnDocument: "after" }
    );

    // Return the updated patient with the assigned providers
    res.status(200).json({ message: 'Providers assigned successfully', patient: updateResult.value });
  } catch (error) {
    console.error('Error assigning providers:', error);
    res.status(500).json({ message: 'Error assigning providers' });
  }
};
