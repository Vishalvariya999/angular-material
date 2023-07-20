import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardGuard } from './features/auth/authguards/admin-guard.guard';
import { CustomerGuardGuard } from './features/auth/authguards/customer-guard.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('src/app/features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canLoad: [AdminGuardGuard],
    loadChildren: () => import('src/app/features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'customer',
    canLoad: [CustomerGuardGuard],
    loadChildren: () => import('src/app/features/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
