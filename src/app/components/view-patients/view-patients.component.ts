import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-view-patients',
  imports: [RouterModule,NgModule],
  templateUrl: './view-patients.component.html',
  styleUrl: './view-patients.component.scss'
})
export class ViewPatientsComponent {
  patients = [
    { firstName: 'John', lastName: 'Doe', state: 'NY', status: 'Active' },
    { firstName: 'Jane', lastName: 'Smith', state: 'CA', status: 'Inactive' }
  ];
}
