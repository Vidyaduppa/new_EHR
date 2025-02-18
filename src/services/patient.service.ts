import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:5000/api/patients'; // Replace with your backend URL
 
  constructor(private http: HttpClient) {}
 
  // Create a new patient
  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, patient);
  }
 
  getPatients(currentPage: number, rows: number): Observable<any> {
    const params = new HttpParams()
      .set('page', currentPage.toString())   // Add page parameter
      .set('limit', rows.toString());       // Add limit parameter
    
    return this.http.get(this.apiUrl, { params }); // Send the GET request with params
  }
 
  // Update a patient by ID
  updatePatient(id: string, patientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patientData);
  }
 
  // Get patient by ID
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
 
  // Delete a patient by ID
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
 