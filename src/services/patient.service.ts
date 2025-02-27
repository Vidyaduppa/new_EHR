import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:5000/api/patients'; // Backend URL

  constructor(private http: HttpClient) {}

  // Create a new patient
  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, patient);}

    getPatients(
      page: number = 1,
      limit: number = 100,
      search: string = "",
      state: string = "",
      status: string = ""
    ): Observable<{ success: boolean; data: { patients: any[] } }> {
      let params = `?page=${page}&limit=${limit}`;
      if (search) params += `&search=${search}`;
      if (state) params += `&state=${state}`;
      if (status) params += `&status=${status}`;
     
      return this.http.get<{ success: boolean; data: { patients: any[] } }>(`${this.apiUrl}${params}`);
    
  }

  // Update a patient by ID
  updatePatient(id: string, patientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patientData);
  }

  getPatientById(patientId: string): Observable<any> {
    const url = `${this.apiUrl}/${patientId}`;
    console.log('Fetching patient from:', url); // Debugging
    return this.http.get<any>(url);
  }

  // Delete a patient by ID
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  softDeletePatient(patientId :string) : Observable<any>{
    return this.http.put(`${this.apiUrl}/${patientId}/soft-delete`, {});
  }
 
  restorePatient(patientId : string):Observable<any>{
    return this.http.put(`${this.apiUrl}/${patientId}/restore`,{});
  }

  storeSelectedProviders(selectedProviders: any[]): Observable<any> {
    const body = {
      assignedProviders: selectedProviders
    };
    
    return this.http.post('/assignProviders', body);  // Modify the endpoint as needed
  }
//   searchPatients(query: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/search`, { params: { query } });
// }
}
