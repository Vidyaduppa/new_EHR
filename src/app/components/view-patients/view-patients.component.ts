import { Component } from '@angular/core';
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
@Component({
  selector: 'app-view-patients',
  imports: [ HttpClientModule,ConfirmDialogModule,RouterModule,DropdownModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
  templateUrl: './view-patients.component.html',
  standalone: true,
  styleUrl: './view-patients.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ViewPatientsComponent {
 
  patients: any[] = [];
  deletedPatients: any[] = []; // Store deleted patients temporarily
 
  constructor(private patientService :PatientService,private router:Router,private confirmationService: ConfirmationService, private messageService: MessageService) {}
  selectedStatus: boolean | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];
  ngOnInit(): void {
      this.loadPatients();
  }
  loadPatients(): void {
    // this.patientService.getPatients().subscribe((response) => {
    //   this.patients = response.data.patients;
 // });
    this.patientService.getPatients().subscribe((response)=>{
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
  onGlobalSearch(event: Event, dt: Table) {const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
      dt.filterGlobal(inputElement.value, 'contains');}
 
      onStatusFilterChange(event: any, table: Table): void {
        table.filter(this.selectedStatus, 'status', 'equals');
      }
     
      // confirmDelete(patient: any) {
      //   this.confirmationService.confirm({
      //     message: 'Are you sure you want to delete this patient?',
      //     header: 'Confirm',
      //     icon: 'pi pi-exclamation-triangle',
      //     accept: () => {
      //       this.patientService.softDeletePatient(patient._id).subscribe(() => {
      //         this.patients = this.patients.filter(p => p._id !== patient._id);
      //         this.deletedPatients.push(patient);
      //         this.loadPatients();
      //         // Set timeout to permanently remove patient after 5 seconds
      //         setTimeout(() => {
      //           this.deletedPatients = this.deletedPatients.filter(p => p._id !== patient._id);
      //         }, 5000);
      //       });
      //     }
      //   });
      // }
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
     
      

 
 