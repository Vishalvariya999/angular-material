import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/features/admin/services/product.service';
import { HeaderServiceService } from 'src/app/shared/services/header-service.service';
import { imgCategory } from '../../interface/product-details';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {

  public frmSelectCat!: FormGroup
  public products: any;
  public prodCategories: any;
  public searchData: string = ''
  public selectCategory: any
  public minVal!: string;
  public maxVal!: string;
  public prices: number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  public prices2: number[] = [250, 350, 300, 4000, 50000, 600, 70000, 800, 90000, 100000];
  public ratingNumber!: string;
  public ratingProducts: any;

  public images: imgCategory[] = [
    {
      name: 'Grocery',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100",
    },
    {
      name: 'Mobiles',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100",
    },
    {
      name: 'Fashion',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png?q=100",
    },
    {
      name: 'Electronics',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100",
    },
    {
      name: 'Home',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100",
    },
    {
      name: 'Appliances',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100",
    },
    {
      name: 'Travel',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100",
    },
    {
      name: 'Top Offers',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100",
    },
    {
      name: 'Beauty,Toys & More',
      img: "https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100",
    },
    {
      name: 'Two Wheeler',
      img: "https://rukminim1.flixcart.com/fk-p-flap/128/128/image/05d708653beff580.png?q=100"
    }
  ]
  constructor(
    private productService: ProductService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private hederServices: HeaderServiceService,
    private toasterService: ToastrService,
    private fb: FormBuilder
  ) {
    this.hederServices.cartIcon.next(true);
    this.hederServices.profileIcon.next(true);
  }

  ngOnInit(): void {
    this.getProducts();
    this.getProductCate();
  }

  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.products = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      })
    })
  }

  showDetails(data: any) {
    this.ngxService.start()
    if (data.id) {
      this.router.navigate([`/customer/dashboard/showDetails/${data.id}`])
    }
    this.ngxService.stop()
  }

  getProductCate() {
    this.productService.getProductCate().subscribe((res) => {
      this.prodCategories = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      })
    })
  }

  selectItem(event: any) {
    console.log('event :>> ', event.value);
    this.productService.getProductCateWise(event.value).then((res: any) => {
      this.products = res.docs.map((data: any) => {
        return {
          ...data.data()
        }
      })
      console.log('this.products :>> ', this.products);
    }).catch((err: any) => {
      this.toasterService.error(err.message, 'Error');
    })

  }


  selectPrice(e: any) {
    this.productService.getProductPrice(parseInt(e.value), parseInt(e.value)).then((res: any) => {
      this.products = res.docs.map((data: any) => {
        return {
          ...data.data()
        }
      });
    }).catch((err: any) => {
      this.toasterService.error(err.message, 'Error');
    })
  }

  sendRating(e: any) {
    this.getProducts()
    this.productService.ratingProduct(e.value).then((res: any) => {
      let abc = res.docs.map((data: any) => {
        return {
          ...data.data()
        }
      })
      let allId = abc.map((data: any) => data.productId)
      this.products = this.products.filter((pro: any) => {
        return allId.includes(pro.id)
      });
    }).catch((err: any) => {
      this.toasterService.error(err.message, 'Error');
    });
  }

  clearFilter() {
    this.getProducts();
  }
}
