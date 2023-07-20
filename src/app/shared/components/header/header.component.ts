import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartPlus, faPowerOff, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Inavitem } from '../../interface/common';
import { HeaderServiceService } from '../../services/header-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/features/admin/services/product.service';
import { MaterialExampleModule } from '../../material.module';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MaterialExampleModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public faPowerOff = faPowerOff;
  public cart = faCartPlus;
  public user = faUserCircle
  public navbar!: Inavitem[];
  public product: any;
  public currentlyLogin: any
  public cartIcon: boolean = false;
  public profileIcon: boolean = false;
  public profile_image!: any;

  constructor(
    private router: Router,
    private headerService: HeaderServiceService,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService
  ) {
    this.profile_image = localStorage.getItem('photo_url') ? localStorage.getItem('photo_url') : 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
    console.log('this.profile_image :>> ', this.profile_image);
  }

  ngOnInit(): void {
    this.headerService.cartIcon.subscribe((res: boolean) => {
      this.cartIcon = res;
    });
    this.headerService.profileIcon.subscribe((res: boolean) => {
      this.profileIcon = res;
    });
    this.currentlyLogin = localStorage.getItem('email');
    this.productService.getCartProduct().subscribe((res: any) => {
      let allCartItem = res.map((data: any) => {
        return {
          email: data.payload.doc.data().email,
          products: {
            id: data.payload.doc.id,
            ...data.payload.doc.data().products
          }
        }
      })
      this.product = allCartItem.filter((data: any) => {
        if (data.email === this.currentlyLogin) {
          return data
        }
      })
    })

    if (localStorage.getItem('role') === 'admin') {
      this.navbar = [
        {
          data: 'Home',
          link: '/admin/dashboard/home'
        },
        {
          data: 'Categories',
          link: '/admin/dashboard/addCategories'
        },
        {
          data: 'Add Products',
          link: '/admin/dashboard/addProduct'
        },
        {
          data: 'View Order',
          link: '/admin/dashboard/viewAllOrder'
        },
      ]
    }
    else {
      this.navbar = [
        {
          data: 'Home',
          link: '/customer/dashboard/products'
        },
        {
          data: 'Orders',
          link: '/customer/dashboard/orders'
        }
      ]
    }
  }

  gotoProfile() {
    this.ngxService.start();
    this.router.navigate(['/customer/dashboard/showProfile']);
    this.ngxService.stop();
  }

  gotoCart() {
    this.ngxService.start();
    this.router.navigate(['/customer/dashboard/cartItem']);
    this.ngxService.stop();
  }

  onLogout() {
    this.headerService.logout();
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}

