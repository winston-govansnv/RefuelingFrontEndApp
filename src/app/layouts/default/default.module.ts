import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import {  MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  MatCardModule } from '@angular/material/card';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {  MatTableModule } from '@angular/material/table';
import { DashboardService } from 'src/app/modules/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { authInterceptorProviders } from 'src/app/_helpers/auth.interceptor';
import { DeliveryModalComponent } from 'src/app/modules/delivery-modal/delivery-modal.component';
import { PlanningComponent } from 'src/app/modules/planning/planning.component';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatExpansionModule } from '@angular/material/expansion'; 
import { jqxSchedulerModule } from 'jqwidgets-ng/jqxscheduler';
import { DxButtonModule } from 'devextreme-angular';
import {DxSchedulerModule} from 'devextreme-angular';
import {DxTemplateModule} from 'devextreme-angular';
import { Service } from 'src/app/_services/planning.service';
import { DashboardDeliveryComponent } from 'src/app/modules/dashboard-delivery/dashboard-delivery.component';
import { ManageDriverComponent } from 'src/app/modules/manage-driver/manage-driver.component';
import { DriverModalComponent } from 'src/app/modules/driver-modal/driver-modal.component';
import { ManageClientComponent } from 'src/app/modules/manage-client/manage-client.component';
import { CustomerModalComponent } from 'src/app/modules/customer-modal/customer-modal.component';
import { ManageTrucksComponent } from 'src/app/modules/manage-trucks/manage-trucks.component';
import { TruckModalComponent } from 'src/app/modules/truck-modal/truck-modal.component';
import { ManageFueltypeComponent } from 'src/app/modules/manage-fueltype/manage-fueltype.component';
import { FueltypeModalComponent } from 'src/app/modules/fueltype-modal/fueltype-modal.component';
import { ManageFuelpriceComponent } from 'src/app/modules/manage-fuelprice/manage-fuelprice.component';
import { FuelpriceModalComponent } from 'src/app/modules/fuelprice-modal/fuelprice-modal.component';
import { ManageUserComponent } from 'src/app/modules/manage-user/manage-user.component';
import { UserModalComponent } from 'src/app/modules/user-modal/user-modal.component';
import { ManageRolesComponent } from 'src/app/modules/manage-roles/manage-roles.component';
import { RoleModalComponent } from 'src/app/modules/role-modal/role-modal.component';
import { ManageUserrolesComponent } from 'src/app/modules/manage-userroles/manage-userroles.component';
import { ManagePermissionComponent } from 'src/app/modules/manage-permission/manage-permission.component';
import { PermissionModalComponent } from 'src/app/modules/permission-modal/permission-modal.component';
import { DepartmentModalComponent } from 'src/app/modules/department-modal/department-modal.component';
import { ManageDepartmentComponent } from 'src/app/modules/manage-department/manage-department.component';
import { ReviewBatchesComponent } from 'src/app/modules/review-batches/review-batches.component';
import { RefuelingComponent } from 'src/app/modules/refueling/refueling.component';
import { ManageRefuelTankComponent } from 'src/app/modules/manage-refuel-tank/manage-refuel-tank.component';
import { RefuelModalComponent } from 'src/app/modules/refuel-modal/refuel-modal.component';
import { ReviewModalComponent } from 'src/app/modules/review-modal/review-modal.component';


import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { PlanningReportModalComponent } from 'src/app/modules/planning-report-modal/planning-report-modal.component';
import { BatchRecordComponent } from 'src/app/modules/batch-record/batch-record.component';
import { PrintLayoutComponent } from 'src/app/modules/print-layout/print-layout.component';
import { DriverScheduleComponent } from 'src/app/modules/driver-schedule/driver-schedule.component';
import { TruckScheduleComponent } from 'src/app/modules/truck-schedule/truck-schedule.component';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    DashboardDeliveryComponent,
    ManageDriverComponent,
    ManageClientComponent,
    ManageTrucksComponent,
    ManageFueltypeComponent,
    ManageFuelpriceComponent,
    ManageUserComponent,
    ManageRolesComponent,
    ManageUserrolesComponent,
    ManagePermissionComponent,
    ManageDepartmentComponent,
    PostsComponent,
    LoginComponent,
    UserModalComponent,
    DeliveryModalComponent,
    DriverModalComponent,
    TruckModalComponent,
    FueltypeModalComponent,
    FuelpriceModalComponent,
    PlanningComponent,
    CustomerModalComponent,
    RoleModalComponent,
    PermissionModalComponent,
    DepartmentModalComponent,
    ReviewBatchesComponent,
    RefuelingComponent,
    ManageRefuelTankComponent,
    RefuelModalComponent,
    ReviewModalComponent,
    PlanningReportModalComponent,
    BatchRecordComponent, PrintLayoutComponent, DriverScheduleComponent, TruckScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    MatExpansionModule,
    jqxSchedulerModule,
    DxButtonModule,
    DxSchedulerModule,
    DxTemplateModule,
   
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  providers: [DashboardService,authInterceptorProviders, Service,DatePipe],
  entryComponents: [DeliveryModalComponent, DriverModalComponent,CustomerModalComponent,
     TruckModalComponent, UserModalComponent,RoleModalComponent,PermissionModalComponent,RefuelModalComponent,ReviewModalComponent,PlanningReportModalComponent]
})
export class DefaultModule { }
