import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './components/category/category.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { MaterialExampleModule } from 'src/app/shared/material.module';
import { FilterDescriptionsPipe } from './pipes/filter-descriptions.pipe';
import { SearchDataPipe } from './pipes/search-data.pipe';
import { MaterialFileInputModule } from 'ngx-material-file-input';



@NgModule({
  declarations: [
    HomeComponent,
    AddProductComponent,
    CategoryComponent,
    ViewOrderComponent,
    FilterDescriptionsPipe,
    SearchDataPipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MaterialExampleModule,
    MaterialFileInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddProductComponent),
    }
  ]
})
export class AdminModule { }
