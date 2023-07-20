import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CategoryComponent } from './components/category/category.component';
import { HomeComponent } from './components/home/home.component';

import { ViewOrderComponent } from './components/view-order/view-order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: HeaderComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'addProduct',
        component: AddProductComponent
      },
      {
        path: 'addCategories',
        component: CategoryComponent
      },
      {
        path: 'viewAllOrder',
        component: ViewOrderComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
