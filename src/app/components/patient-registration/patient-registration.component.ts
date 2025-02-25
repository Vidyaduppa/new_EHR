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
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-patient-Registration',
  templateUrl: './patient-Registration.component.html',
  styleUrls: ['./patient-Registration.component.scss'],
  imports: [NgIf,InputSwitchModule, FormsModule,DropdownModule,RouterModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule,ReactiveFormsModule],
  standalone: true,
  providers: [MessageService],
})
// export class PatientRegistrationComponent implements OnInit {
//   users: any[] = []; // To hold the list of users
//   selectedProvider: any; // To hold the selected user from the dropdown
// onStatusChange($event: InputSwitchChangeEvent) {
// throw new Error('Method not implemented.');
// }
 
//   @Output() patientAdded = new EventEmitter<any>();
//   patientForm!: FormGroup;
//   submitted = false;
 
//   patient: any = {
//     first_name: '',
//     last_name: '',
//     email: '',
//     mobile_phone: '',
//     address_line_1: '',
//     address_line_2: '',
//     city: '',
//     state: '',
//     zipcode: '',
//     country: 'US',
//     notes: '',
//     dob: '',
//     gender: '',
//     allowShare: false,
//     status: true,
//   };
 
//   isEditMode = false; // Flag to check if the form is in edit mode
//   patientId!: string  // Store the patient ID for editing
 
//   cities = [
//     { name: 'New York' },
//     { name: 'Los Angeles' },
//     { name: 'Chicago' },
//   ];
 
//   states = [
//     { name: 'California' },
//     { name: 'Texas' },
//     { name: 'Florida' },
//   ];
 
//   countries = [
//     { name: 'United States' },
//     { name: 'Canada' },
//     { name: 'United Kingdom' },
//   ];
 
//   providers = [
//     { id: 1, name: 'Provider 1' },
//     { id: 2, name: 'Provider 2' },
//     { id: 3, name: 'Provider 3' }
//   ];
  
 
//   constructor(
//     private patientService: PatientService,
//     private messageService: MessageService,
//     private fb :FormBuilder,
//     private route: ActivatedRoute, // Inject ActivatedRoute
//     private router: Router,
//     private authService:AuthService
//   ) {}
 
 
//   ngOnInit(): void {
   
//     this.route.paramMap.subscribe((params) => {
//       this.patientId = params.get('id')!; // Get the patient ID from the route
//       if (this.patientId) {
//         this.isEditMode = true; // Set the form to edit mode
//         this.loadPatientDetails(this.patientId); // Load the patient's details
//       }
//     });
//   }
  
 
//   loadPatientDetails(patientId: string): void {
//     this.patientService.getPatientById(patientId).subscribe(
//   (response : any)=>{
//     if(response && response.data){
//       this.patient = {
//         ...response.data, // Spread the patient data
//         city: { name: response.data.city }, // Convert city string to object
//         state: { name: response.data.state }, // Convert state string to object
//         country: { name: response.data.country }, // Convert country string to object
//         dob: new Date(response.data.dob), // Convert string to Date object
//         updatedDate:new Date().toUTCString(),
//       };
//     }else{
//       console.error("Patient not Found");
//     }
//   },
//   (error: any)=>{
//          console.error("Error fetching patient data :",error);
//   }
//   );
//   }
//   onSubmit(): void {
//     const payload = {
//       ...this.patient,
//       city: this.patient.city.name,
//       state: this.patient.state.name,
//       country: this.patient.country.name,
//       status:this.patient.status?1:0
//     };
   
//     if (this.isEditMode && this.patientId) {
//       // Update existing patient
//       this.patientService.updatePatient(this.patientId, payload).subscribe({
//         next: (response) => {
//           console.log('Patient updated successfully', response);
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Patient updated successfully!',
//           });
//           this.router.navigate(['/dashboard/viewPatients']); // Navigate back to the patient list
//         },
//         error: (error) => {
//           console.error('Error updating patient', error);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to update patient. Please try again.',
//           });
//         },
//       });
//     } else {
//       // Create new patient
//       this.patientService.createPatient(payload).subscribe({
//         next: (response) => {
//           console.log('Patient created successfully', response);
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Patient created successfully!',
//           });
//           // Perform reset after 5 seconds (5000 milliseconds)
//     setTimeout(() => {
//       this.resetForm();
//     }, 1000);
//         },
//         error: (error) => {
//           console.error('Error creating patient', error);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to create patient. Please try again.',
//           });
//         },
//       });
//     }
//   }
//   cancelEdit(){
//     this.router.navigate(['/dashboard/viewPatients']);
//   }
//   resetForm(): void {
// this.patientForm.reset({
//   country:'US',
//   allowShare:false,
//   status:true,
// });
//   }
//   }

export class PatientRegistrationComponent implements OnInit {
users: any[] = [];  // To hold the list of users (providers)
selectedProvider: any;  // To hold the selected provider from the dropdown

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

isEditMode = false;
patientId!: string;

// Cities, states, countries
cities = [
  { name: 'New York' },
  { name: 'Los Angeles' },
  { name: 'Chicago' }
];

states = [
  { name: 'California' },
  { name: 'Texas' },
  { name: 'Florida' }
];

countries = [
  { name: 'United States' },
  { name: 'Canada' },
  { name: 'United Kingdom' }
];

constructor(
  private patientService: PatientService,
  private messageService: MessageService,
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authService: AuthService  // Inject AuthService
) {}

ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
    this.patientId = params.get('id')!;
    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatientDetails(this.patientId);
    }
  });

  // Fetch users (providers) from AuthService
  this.authService.getUsers().subscribe((response) => {
    if (response.success) {
      this.users = response.data.map((user: { first_name: any; last_name: any; id: any; }) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id  // You can store the user ID
      }));
    }
  });

  this.initializeForm();
}

// Initialize the patient form with validations
initializeForm(): void {
  this.patientForm = this.fb.group({
    first_name: [this.patient.first_name, Validators.required],
    last_name: [this.patient.last_name, Validators.required],
    email: [this.patient.email, [Validators.required, Validators.email]],
    mobile_phone: [this.patient.mobile_phone, Validators.required],
    address_line_1: [this.patient.address_line_1, Validators.required],
    address_line_2: [this.patient.address_line_2],
    city: [this.patient.city, Validators.required],
    state: [this.patient.state, Validators.required],
    zipcode: [this.patient.zipcode, Validators.required],
    country: [this.patient.country, Validators.required],
    notes: [this.patient.notes],
    dob: [this.patient.dob, Validators.required],
    gender: [this.patient.gender, Validators.required],
    allowShare: [this.patient.allowShare],
    status: [this.patient.status]
  });
}

// Function to load patient details in edit mode
loadPatientDetails(patientId: string): void {
  this.patientService.getPatientById(patientId).subscribe(
    (response: any) => {
      if (response && response.data) {
        this.patient = {
          ...response.data,
          city: { name: response.data.city },
          state: { name: response.data.state },
          country: { name: response.data.country },
          dob: new Date(response.data.dob),
          updatedDate: new Date().toUTCString()
        };
        this.initializeForm();  // Re-initialize form with updated patient data
      } else {
        console.error('Patient not found');
      }
    },
    (error) => {
      console.error('Error fetching patient data:', error);
    }
  );
}

// Submit the form (create or update patient)
onSubmit(): void {
  const payload = {
    ...this.patient,
    city: this.patient.city.name,
    state: this.patient.state.name,
    country: this.patient.country.name,
    status: this.patient.status ? 1 : 0
  };

  if (this.isEditMode && this.patientId) {
    // Update patient
    this.patientService.updatePatient(this.patientId, payload).subscribe({
      next: (response) => {
        console.log('Patient updated successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient updated successfully!'
        });
        this.router.navigate(['/dashboard/viewPatients']);
      },
      error: (error) => {
        console.error('Error updating patient', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update patient. Please try again.'
        });
      }
    });
  } else {
    // Create new patient
    this.patientService.createPatient(payload).subscribe({
      next: (response) => {
        console.log('Patient created successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient created successfully!'
        });
        setTimeout(() => {
          this.resetForm();
        }, 1000);
      },
      error: (error) => {
        console.error('Error creating patient', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create patient. Please try again.'
        });
      }
    });
  }
}

// Reset the form after creation
resetForm(): void {
  this.patientForm.reset({
    country: 'US',
    allowShare: false,
    status: true
  });
}

// Function to handle status toggle change
onStatusChange(event: any): void {
  console.log('Status changed:', event);
}

// Cancel editing and navigate back
cancelEdit(): void {
  this.router.navigate(['/dashboard/viewPatients']);
}

  onProviderSelect(event: any): void {
    console.log('Provider selected:', event.value);

    // Send the selected provider's ID to the backend
    this.authService.storeSelectedProvider(event.value).subscribe(
      (response) => {
        console.log('Provider stored successfully:', response);
        // Optionally, show a success message or do something else
      },
      (error) => {
        console.error('Error storing provider:', error);
        // Optionally, show an error message to the user
      }
    );
  }
  }



 