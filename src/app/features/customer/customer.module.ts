import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { ShowProductsComponent } from './components/show-products/show-products.component';
import { DescriptionPipe } from './pipes/description.pipe';
import { ShowProductDetailsComponent } from './components/show-product-details/show-product-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { FilterProductPipe } from './pipes/filter-product.pipe';
import { MaterialExampleModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    ShowProductsComponent,
    DescriptionPipe,
    ShowProductDetailsComponent,
    CustomerProfileComponent,
    CartItemsComponent,
    OrderDetailsComponent,
    FilterProductPipe
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
  ]
})
export class CustomerModule { }
