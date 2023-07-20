import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faMinus, faMinusCircle, faPlus, faPlusCircle, faPlusSquare, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/features/admin/services/product.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { HeaderServiceService } from 'src/app/shared/services/header-service.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {
  public add = faPlus;
  public plus = faPlus;
  public minus = faMinus;
  public trash = faTrash;
  public triangle = faTriangleExclamation;
  public data: any;
  public product: any;
  public user: any
  public currentlyLogin: any;
  public quentity: number = 1;
  public totalPrice: number = 0;
  public tblHeader: string[] = ['No', 'Image', 'Name', 'Price', 'Description', 'Category', 'Brand', 'Quentity', 'Operation'];
  public cartItemId!: string;
  public elementId!: string;
  public frmOrder!: FormGroup;
  public removeId!: string;
  public updatedTotalValue: any

  constructor(
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    private headerServices: HeaderServiceService
  ) {
    this.frmVali()
    this.headerServices.cartIcon.next(true);
    this.headerServices.profileIcon.next(true);
  }

  ngOnInit(): void {
    this.currentlyLogin = localStorage.getItem('email');
    this.activatedRoute.paramMap.subscribe((param: any) => {
      this.data = param.get('data');
    });
    this.authService.getUsers().subscribe((res: any) => {
      console.log('res :>> ', res);
      let data = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      });
      this.user = data.filter((data: any) => {
        return data.email === this.currentlyLogin
      });
      console.log('this.user :>> ', this.user);
    });
    this.getCartItem();
  }

  frmVali() {
    this.frmOrder = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  fetchData() {
    this.frmOrder.patchValue({
      displayName: this.user[0].displayName,
      email: this.user[0].email,
      phone: this.user[0].phone,
      address: this.user[0].address
    })
  }

  addOrder() {
    const data = {
      displayName: this.frmOrder.value.name,
      email: this.frmOrder.value.email,
      phone: this.frmOrder.value.phone,
      address: this.frmOrder.value.address,
      products: this.product,
      payment: 'COD',
      date: Date(),
      total: this.totalPrice
    }
    this.productService.addOrder(data).then((res: any) => {
      this.toastrService.success("Place Order successfully", 'Success')
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error')
    })

    this.product.forEach((data: any) => {
      this.productService.removeCartItem(data.id).then((res: any) => {

      }).catch((err: any) => {
        this.toastrService.error(err.message, 'Error')
      })
    })
  }

  gotoAllProduct() {
    this.ngxService.start();
    this.router.navigate(['customer/dashboard/products']);
    this.ngxService.stop();
  }

  getCartItem() {
    this.productService.getCartProduct().subscribe((res: any) => {
      let allCartItem = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          email: data.payload.doc.data().email,
          products: {
            id: data.payload.doc.id,
            ...data.payload.doc.data().products
          }
        }
      });
      this.product = allCartItem.filter((data: any) => {
        return data.email === this.currentlyLogin
      });
      if (this.product.length != 0) {
        let prices = this.product.map((price: any) => price.products.price * price.products.quentity);
        this.totalPrice = prices.reduce((total: any, ind: any) => total + ind);
      }
    });
  }

  addQuentity(id: string, data: any) {
    let price = 0
    this.product.filter((ele: any) => {
      if (ele.id === id) {
        data.quentity++
        price = data.quentity * data.price;
        this.totalPrice += data.price;
      }
    });
  }

  rmQuentity(id: string, data: any) {
    let price = 0
    this.product.filter((ele: any) => {
      if (ele.id === id) {
        if (data.quentity - 1 < 1) {
          data.quentity = 1
        }
        else {
          data.quentity--
          price = data.quentity * data.price;
          this.totalPrice -= data.price;
        }
      }
    })
  }

  sendCartId(id: string) {
    this.cartItemId = id;
  }

  removeCart() {
    this.productService.removeCartItem(this.cartItemId).then((res: any) => {
      this.toastrService.success("Data delete successfully!", 'Success');
      this.getCartItem();
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error');
    })
  }


} 
