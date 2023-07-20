import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBoltLightning, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/features/admin/services/product.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { HeaderServiceService } from 'src/app/shared/services/header-service.service';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.scss']
})
export class ShowProductDetailsComponent implements OnInit {
  public currentlyLogin: any;
  public product: any;
  public pid: any;
  public cartEmail: any;
  public user: any
  public cart = faCartPlus;
  public light = faBoltLightning;

  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private headerServices: HeaderServiceService,
    private toastrService: ToastrService
  ) {
    this.headerServices.cartIcon.next(true);
    this.headerServices.profileIcon.next(true);
  }

  ngOnInit(): void {
    this.currentlyLogin = localStorage.getItem('email')
    this.activateRoute.paramMap.subscribe((param: any) => {
      this.pid = param.get('id');
    })
    this.authService.getUsers().subscribe((res: any) => {
      this.user = res.filter((data: any) => {
        data.email === this.currentlyLogin
      })
    })
    this.getProduct()
  }

  getProduct() {
    this.productService.getProductDetail(this.pid).subscribe((res: any) => {
      this.product = res
    })
  }

  onSendData(data: any) {
    this.productService.getCartProduct().subscribe((res: any) => {
      this.cartEmail = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          email: data.payload.doc.data().email,
          ...data.payload.doc.data().products
        }
      })
    })
    if (this.user) {
      data = {
        email: this.currentlyLogin,
        products: {
          ...data,
          id: this.pid,
          quentity: 1
        }
      }
      this.productService.addCartProduct(data).then((res: any) => {
        this.toastrService.success("Add to cart item successfully!", 'Success');
      }).catch((err: any) => {
        this.toastrService.error(err.message, 'Error');
      })
      this.router.navigate(['/customer/dashboard/cartItem']);
    }
  }
}
