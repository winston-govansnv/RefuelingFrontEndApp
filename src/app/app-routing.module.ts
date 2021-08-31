import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardDeliveryComponent } from './modules/dashboard-delivery/dashboard-delivery.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DriverScheduleComponent } from './modules/driver-schedule/driver-schedule.component';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';
import { LoginComponent } from './modules/login/login.component';
import { ManageClientComponent } from './modules/manage-client/manage-client.component';
import { ManageDepartmentComponent } from './modules/manage-department/manage-department.component';
import { ManageDriverComponent } from './modules/manage-driver/manage-driver.component';
import { ManageFuelpriceComponent } from './modules/manage-fuelprice/manage-fuelprice.component';
import { ManageFueltypeComponent } from './modules/manage-fueltype/manage-fueltype.component';
import { ManagePermissionComponent } from './modules/manage-permission/manage-permission.component';
import { ManageRefuelTankComponent } from './modules/manage-refuel-tank/manage-refuel-tank.component';
import { ManageRolesComponent } from './modules/manage-roles/manage-roles.component';
import { ManageTrucksComponent } from './modules/manage-trucks/manage-trucks.component';
import { ManageUserComponent } from './modules/manage-user/manage-user.component';
import { ManageUserrolesComponent } from './modules/manage-userroles/manage-userroles.component';
import { PlanningComponent } from './modules/planning/planning.component';
import { PostsComponent } from './modules/posts/posts.component';
import { PrintLayoutComponent } from './modules/print-layout/print-layout.component';
import { RefuelingComponent } from './modules/refueling/refueling.component';
import { ReviewBatchesComponent } from './modules/review-batches/review-batches.component';
import { TruckScheduleComponent } from './modules/truck-schedule/truck-schedule.component';
import { AuthGuard } from './_guards/auth.guards';
import { authInterceptorProviders } from './_helpers/auth.interceptor';




const routes: Routes=[{
    path:'',
    component: DefaultComponent,
    children:[{
        path:'dashboard',
        component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', second:'Dashboard', name:'Summarized deliveryies'}
    },{
        path:'dashboard-delivery',
        component: DashboardDeliveryComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', second:'Dashboard', name:'Track deliveries'}
    },{
        path: 'deliveries',
        component: PostsComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', second:'Reports', name:'Deliveries'}
    },{
        path: 'refueling',
        component: RefuelingComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', name:'Refueling'}
    },{
        path: 'review-batches',
        component: ReviewBatchesComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', name:'Review deliveries'}
    },{
        path: 'manage-department',
        component: ManageDepartmentComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', name:'Departments'}
    },{
        path: 'planning',
        component: PlanningComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Pages', name:'Planning'}
    },{
        path: 'manage-client',
        component: ManageClientComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Administration',name:'Customers'}
    },{
        path: 'manage-driver',
        component: ManageDriverComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Administration',name:'Drivers'}
    },{
        path: 'manage-truck',
        component: ManageTrucksComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Administration',name:'Fuel trucks'}
    },{
        path: 'manage-fueltype',
        component: ManageFueltypeComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Administration',name:'Fuel types'}
    },{
        path: 'manage-fuelprice',
        component: ManageFuelpriceComponent, canActivate: [AuthGuard], data: { roles: ['supervisor'],home:'Administration',name:'Fuel prices'}
    },{
        path: 'manage-user',
        component: ManageUserComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Administration',name:'Manage user'}
    },{
        path: 'manage-role',
        component: ManageRolesComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Administration',name:'Manage roles'}
    },{
        path: 'manage-userroles',
        component: ManageUserrolesComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Administration',name:'Assign roles'}
    },{
        path: 'manage-permissions',
        component: ManagePermissionComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Administration',name:'Manage permissions'}
    },{
        path: 'manage-refuel-tank',
        component: ManageRefuelTankComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Administration',name:'Manage refuel tanks'}
    },{
        path: 'driver-schedule',
        component: DriverScheduleComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Pages',second:'Reports',name:'Driver schedule'}
    },{
        path: 'truck-schedule',
        component: TruckScheduleComponent, canActivate: [AuthGuard], data: { roles: ['admin'],home:'Pages',second:'Reports',name:'Truck schedule'}
    },{
        path: 'login',
        component: LoginComponent
    },{
        path: 'forbidden',
        component: ForbiddenComponent
    },{
        path: '',
        component: LoginComponent
    }]

}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule] ,
    providers: [authInterceptorProviders]
})

export class AppRoutingModule {}