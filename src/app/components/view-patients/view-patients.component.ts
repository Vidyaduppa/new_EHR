import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Table, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { NgClass } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { PatientService } from '../../../services/patient.service';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PatientRegistrationComponent } from '../patient-registration/patient-registration.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-patients',
  imports: [ CommonModule,TooltipModule, HttpClientModule,ConfirmDialogModule,RouterModule,DropdownModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
  templateUrl: './view-patients.component.html',
  standalone: true,
  styleUrl: './view-patients.component.scss',
  providers: [ConfirmationService, MessageService]
})
// export class ViewPatientsComponent {
 
//   patients: any[] = [];
//   deletedPatients: any[] = []; // Store deleted patients temporarily
 
//   constructor(private patientService :PatientService,private router:Router,private confirmationService: ConfirmationService, private messageService: MessageService) {}
//   selectedStatus: boolean | null = null;
//   statusOptions = [
//     { label: 'All', value: null },
//     { label: 'Active', value: true },
//     { label: 'Inactive', value: false },
//   ];
  
//   ngOnInit(): void {
//       this.loadPatients();
//   }
//   loadPatients(): void {

//     this.patientService.getPatients().subscribe((response)=>{
//       this.patients = response.data.patients.filter(patient => patient.status !== 2); 
//     });
   
   
//   }
//   onEditPatient(patientId: string): void {
//     console.log('Navigating to edit with patientId:', patientId); // Debugging the patientId
//   if (patientId) {
//     this.router.navigate(['/dashboard/edit-patient', patientId]);
   
//   } else {
//     console.error('Invalid patientId');
//   }
//   }
//   onGlobalSearch(event: Event, dt: Table) {const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
//       dt.filterGlobal(inputElement.value, 'contains');}
 
//       onStatusFilterChange(event: any, table: Table): void {
//         table.filter(this.selectedStatus, 'status', 'equals');
//       }
     
//       // confirmDelete(patient: any) {
//       //   this.confirmationService.confirm({
//       //     message: 'Are you sure you want to delete this patient?',
//       //     header: 'Confirm',
//       //     icon: 'pi pi-exclamation-triangle',
//       //     accept: () => {
//       //       this.patientService.softDeletePatient(patient._id).subscribe(() => {
//       //         this.patients = this.patients.filter(p => p._id !== patient._id);
//       //         this.deletedPatients.push(patient);
//       //         this.loadPatients();
//       //         // Set timeout to permanently remove patient after 5 seconds
//       //         setTimeout(() => {
//       //           this.deletedPatients = this.deletedPatients.filter(p => p._id !== patient._id);
//       //         }, 5000);
//       //       });
//       //     }
//       //   });
//       // }
//       confirmDelete(patient: any) {
//         this.confirmationService.confirm({
//           message: 'Are you sure you want to delete this patient?',
//           header: 'Confirm',
//           icon: 'pi pi-exclamation-triangle',
//           accept: () => {
//             this.patientService.softDeletePatient(patient._id).subscribe(
//               (response) => {
//                 if (response.success) {
//                   this.patients = this.patients.filter(p => p._id !== patient._id);
//                   this.deletedPatients.push(patient);
//                   this.loadPatients(); // 🔹 Ensure data refreshes after deletion
//                 }
//               },
//               (error) => {
//                 console.error("Error deleting patient:", error);
//               }
//             );
//           }
//         });
//       }
      
      
//       undoDelete(patientId: string) {
//         this.patientService.restorePatient(patientId).subscribe(() => {
//           this.loadPatients();
//           this.deletedPatients = this.deletedPatients.filter((p) => p._id !== patientId);
//         });
//       }
//     }
export class ViewPatientsComponent implements OnInit, OnDestroy {

  patients: any[] = [];
  deletedPatients: any[] = []; // Store deleted patients temporarily
  searchQuery: string = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>(); // For unsubscribing on component destroy

  selectedStatus: boolean | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  constructor(
    private patientService: PatientService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPatients();

    // Set up the search with debounce time
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    ).subscribe(searchQuery => {
      this.searchQuery = searchQuery;
      this.loadPatients();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to trigger unsubscription
    this.destroy$.complete(); // Complete the subject
  }

  loadPatients(): void {
    this.patientService.getPatients(1, 5, this.searchQuery).subscribe((response) => {
      this.patients = response.data.patients.filter(patient => patient.status !== 2); 
    });
  }

  onEditPatient(patientId: string): void {
    console.log('Navigating to edit with patientId:', patientId); // Debugging the patientId
    if (patientId) {
      this.router.navigate(['/dashboard/edit-patient', patientId]);
    } else {
      console.error('Invalid patientId');
    }
  }

  onGlobalSearch(event: Event, dt: Table): void {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    this.searchSubject.next(inputElement.value); // Emit value for search
  }

  onStatusFilterChange(event: any, table: Table): void {
    table.filter(this.selectedStatus, 'status', 'equals');
  }

  confirmDelete(patient: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this patient?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.patientService.softDeletePatient(patient._id).subscribe(
          (response) => {
            if (response.success) {
              this.patients = this.patients.filter(p => p._id !== patient._id);
              this.deletedPatients.push(patient);
              this.loadPatients(); // 🔹 Ensure data refreshes after deletion
            }
          },
          (error) => {
            console.error("Error deleting patient:", error);
          }
        );
      }
    });
  }

  undoDelete(patientId: string) {
    this.patientService.restorePatient(patientId).subscribe(() => {
      this.loadPatients();
      this.deletedPatients = this.deletedPatients.filter((p) => p._id !== patientId);
    });
  }
}
      

 
 