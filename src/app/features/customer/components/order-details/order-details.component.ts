import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/features/admin/services/product.service';
import { HeaderServiceService } from 'src/app/shared/services/header-service.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  public orders: any
  public currentlyLogin: any;
  public frmRating!: FormGroup;
  public ratingData: any;
  public productId!: string;

  constructor(
    private productService: ProductService,
    private headerService: HeaderServiceService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.frmVal()
  }



  ngOnInit(): void {
    this.currentlyLogin = localStorage.getItem('email');

    this.getOrders()
    this.headerService.cartIcon.next(true);
    this.headerService.profileIcon.next(true);
  }

  frmVal() {
    this.frmRating = this.fb.group({
      rating: ['', Validators.required],
      review: ['', Validators.required]
    })
  }

  getOrders() {
    this.productService.perticularOrder(this.currentlyLogin).then((res: any) => {
      this.orders = res.docs.map((data: any) => {
        return {
          ...data.data()
        }
      })
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error');
    })
  }

  sendProductId(id: string) {
    this.productId = id
  }

  onSenddata() {
    const data = {
      rating: this.frmRating.value.rating,
      review: this.frmRating.value.review,
      email: this.currentlyLogin,
      productId: this.productId
    }
    this.productService.addRatingProduct(data).then((res: any) => {
      this.toastrService.success("Rating successfully", 'Success')
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error')
    })
    this.frmRating.reset()
  }
}
