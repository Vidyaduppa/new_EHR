const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Route to create a new patient
router.post('/patients/register', patientController.createPatient);

// Route to get all patients with pagination, search, and filters
router.get('/patients', patientController.getPatients);

// Route to update a patient's information
router.put('/patients/:id', patientController.updatePatient);

// Route to soft delete a patient (update status to false)
router.delete('/patients/:id', patientController.deletePatient);

// Route to get a single patient by ID
router.get('/patients/:id', patientController.getPatientById);

//Soft delete a patient
router.put('/patients/:id/soft-delete', patientController.softDeletePatient);
 
//Restore a soft-deleted patient
router.put('patients/:id/restore',patientController.restorePatient);


module.exports = router;