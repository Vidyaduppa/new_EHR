import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { DrawerModule } from 'primeng/drawer';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../services/patient.service';
@Component({
  selector: 'app-patient-Registration',
  templateUrl: './patient-Registration.component.html',
  styleUrls: ['./patient-Registration.component.scss'],
  imports: [NgIf,InputSwitchModule, FormsModule,DropdownModule,RouterModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule,ReactiveFormsModule],
  standalone: true,
  providers: [MessageService],
})
export class PatientRegistrationComponent implements OnInit {
 
onStatusChange($event: InputSwitchChangeEvent) {
throw new Error('Method not implemented.');
}
 
  @Output() patientAdded = new EventEmitter<any>();
  patientForm!: FormGroup;
  submitted = false;
 
  patient: any = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'US',
    notes: '',
    dob: '',
    gender: '',
    allowShare: false,
    status: true,
  };
 
  isEditMode = false; // Flag to check if the form is in edit mode
  patientId!: string  // Store the patient ID for editing
 
  cities = [
    { name: 'New York' },
    { name: 'Los Angeles' },
    { name: 'Chicago' },
  ];
 
  states = [
    { name: 'California' },
    { name: 'Texas' },
    { name: 'Florida' },
  ];
 
  countries = [
    { name: 'United States' },
    { name: 'Canada' },
    { name: 'United Kingdom' },
  ];
 
  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private fb :FormBuilder,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router
  ) {}
 
 
  ngOnInit(): void {
   
    this.route.paramMap.subscribe((params) => {
      this.patientId = params.get('id')!; // Get the patient ID from the route
      if (this.patientId) {
        this.isEditMode = true; // Set the form to edit mode
        this.loadPatientDetails(this.patientId); // Load the patient's details
      }
    });
  }
 
  loadPatientDetails(patientId: string): void {
    this.patientService.getPatientById(patientId).subscribe(
  (response : any)=>{
    if(response && response.data){
      this.patient = {
        ...response.data, // Spread the patient data
        city: { name: response.data.city }, // Convert city string to object
        state: { name: response.data.state }, // Convert state string to object
        country: { name: response.data.country }, // Convert country string to object
        dob: new Date(response.data.dob), // Convert string to Date object
        updatedDate:new Date().toUTCString(),
      };
    }else{
      console.error("Patient not Found");
    }
  },
  (error: any)=>{
         console.error("Error fetching patient data :",error);
  }
  );
  }
  onSubmit(): void {
    const payload = {
      ...this.patient,
      city: this.patient.city.name,
      state: this.patient.state.name,
      country: this.patient.country.name,
    };
   
    if (this.isEditMode && this.patientId) {
      // Update existing patient
      this.patientService.updatePatient(this.patientId, payload).subscribe({
        next: (response) => {
          console.log('Patient updated successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient updated successfully!',
          });
          this.router.navigate(['/dashboard/viewPatients']); // Navigate back to the patient list
        },
        error: (error) => {
          console.error('Error updating patient', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update patient. Please try again.',
          });
        },
      });
    } else {
      // Create new patient
      this.patientService.createPatient(payload).subscribe({
        next: (response) => {
          console.log('Patient created successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient created successfully!',
          });
          // Perform reset after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      this.resetForm();
    }, 1000);
        },
        error: (error) => {
          console.error('Error creating patient', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create patient. Please try again.',
          });
        },
      });
    }
  }
  cancelEdit(){
    this.router.navigate(['/dashboard/viewPatients']);
  }
  resetForm(): void {
this.patientForm.reset({
  country:'US',
  allowShare:false,
  status:true,
});
  }
  }
  

 