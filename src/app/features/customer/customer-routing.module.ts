import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { ShowProductDetailsComponent } from './components/show-product-details/show-product-details.component';
import { ShowProductsComponent } from './components/show-products/show-products.component';

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
        path: 'products',
        component: ShowProductsComponent
      },
      {
        path: 'showDetails/:id',
        component: ShowProductDetailsComponent
      },
      {
        path: 'showProfile',
        component: CustomerProfileComponent
      },
      {
        path: 'cartItem',
        component: CartItemsComponent
      },
      {
        path: 'orders',
        component: OrderDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
