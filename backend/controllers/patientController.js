const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.createPatient = async (req, res) => {
  try {
    const db = getDB();
    const patient = req.body;
    
    const result = await db.collection("patients").insertOne(patient);
    res.status(201).json({ success: true, data: result.ops[0], error: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { message: "Server error." } });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search, state, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { first_name: new RegExp(search, 'i') },
        { last_name: new RegExp(search, 'i') },
      ];
    }

    if (state) query.state = state;
    if (status !== undefined) query.status = status === 'true';

    const skip = (page - 1) * limit;
    const patients = await db.collection("patients")
      .find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .toArray();

    const count = await db.collection("patients").countDocuments(query);
    res.status(200).json({ success: true, data: { patients, total: count }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: 'Server error.' } });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    res.status(200).json({ success: true, data: result.value, error: null });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: "Server error." } });
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
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    
    if (!patient) {
      return res.status(404).json({ success: false, error: { message: "Patient not found" } });
    }
    res.status(200).json({ success: true, data: patient, error: null });
  } catch (err) {
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

exports.softDeletePatient = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const result = await db.collection("patients").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { deleted: true } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient soft-deleted", patient: result.value });
  } catch (error) {
    res.status(500).json({ message: "Error soft-deleting patient", error });
  }
};

exports.registerPatient = async (req, res) => {
  try {
    const db = getDB();
    console.log("Received patient data:", req.body);
    const result = await db.collection("patients").insertOne(req.body);
    res.status(200).json({ message: "Patient registered successfully!", patient: result.ops[0] });
  } catch (error) {
    res.status(500).json({ message: "Error registering patient" });
  }
};
