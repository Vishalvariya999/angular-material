import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faPen, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  public frmProduct!: FormGroup;
  public faPen = faPen;
  public faTrash = faTrash;
  public triangle = faTriangleExclamation
  public isSubmited: boolean = false;
  public prodCategories: any
  public products: any
  public confirmId!: string;
  public btnName: string = "Add Product";
  public edit: boolean = false
  public path: any;
  public downloadURL!: Observable<any>
  public event: any;
  public tblHeader: string[] = ['Id', 'Name', 'Brand', 'Price', 'Category', 'Description', 'Image', 'Operations'];
  public displayedColumns: string[] = ['Id', 'Name', 'Brand', 'Price', 'Category', 'Description', 'Image', 'Operations'];
  public dataSource!: MatTableDataSource<any>;
  public searchData: string = ''

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private productService: ProductService,
    private angularFireStorage: AngularFireStorage
  ) {
    this.formValidation();
  }

  ngOnInit(): void {
    this.getProductCategories();
    this.getProducts();
  }


  formValidation() {
    this.frmProduct = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  get frmControl() {
    return this.frmProduct.controls
  }

  getProductCategories() {
    this.productService.getProductCate().subscribe((res) => {
      this.prodCategories = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      })
    })
  }

  upload(event: any) {
    this.event = event
    console.log('this.event :>> ', this.event);
  }

  addImg(event: any) {
    const n = Date()
    const file = event.target.files[0];
    const filePath = `productImg/${n}`;
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(`productImg/${n}`, file);
    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.path = url;
              resolve(this.path);
            }
          })
        })
      ).subscribe((resUrl: any) => { })
    })
  }

  async onAddProduct() {
    if (this.frmProduct.invalid) {
      this.isSubmited = true
      this.toastrService.error('Please fill all details', 'Error')
    }
    else {
      if (this.btnName === 'Add Product') {
        await this.addImg(this.event);
        let data = {
          ...this.frmProduct.value,
          image: this.path
        }
        this.productService.addProduct(data).then((res: any) => {
          this.toastrService.success("Product added successfully!!", 'Success');
          this.frmProduct.reset()
        }).catch((err: any) => {
          this.toastrService.error(err.message, 'Error')
        })
      }
      else if (this.btnName === 'Update Product') {
        let data = {
          ...this.frmProduct.value,
        }
        this.productService.updateProduct(this.confirmId, data).then((res: any) => {
          this.toastrService.success("Product edit successfully!!", 'Success');
        }).catch((err: any) => {
          this.toastrService.error(err.message, 'Error')
        })
        this.frmProduct.reset()
        this.btnName = 'Add Product'
        this.edit = false
      }
    }
  }

  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.products = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      })
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator
    })
  }

  searchProducts(event: any) {
    event = event.target.value.trim();
    event = event.toLowerCase();
    this.dataSource.filter = event;
  }

  editMode(data: any) {
    this.edit = true
    this.btnName = "Update Product"
    this.frmProduct.patchValue({
      name: data.name,
      brand: data.brand,
      price: data.price,
      category: data.category,
      description: data.description,
      // image: data.image
    })
  }

  sendId(id: string) {
    this.confirmId = id
  }

  deleteProductCategory() {
    this.productService.deleteProduct(this.confirmId).then((res: any) => {
      this, this.toastrService.success('Delete Recored Succesfully', 'Success')
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error')
    })
  }
}
