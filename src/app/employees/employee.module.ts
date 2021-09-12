import { NgModule } from '@angular/core';

import { EmployeeRoutingModule } from './employee-routing.module';

import { CreateEmployeesComponent } from './create-employees.component';
import { ListEmployeesComponent } from './list-employees.component';
import { SharedModule } from '../shared/shared.module';





@NgModule({
  declarations: [
    CreateEmployeesComponent,
    ListEmployeesComponent
  ],
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
