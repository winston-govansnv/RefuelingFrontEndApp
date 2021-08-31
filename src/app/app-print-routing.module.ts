import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { DriverScheduleComponent } from './modules/driver-schedule/driver-schedule.component';
import { PrintLayoutComponent } from './modules/print-layout/print-layout.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';

const routes: Routes=[{
    path: 'print',
    component: PrintLayoutComponent,
    children: [
    { path: 'invoice', component: DriverScheduleComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule] ,
    providers: [authInterceptorProviders]
})

export class AppPrintRoutingModule {}