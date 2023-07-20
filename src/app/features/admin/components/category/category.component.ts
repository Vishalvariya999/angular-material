import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faPen, faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public frmCategories!: FormGroup;
  public isSubmited: boolean = false;
  public faPen = faPen;
  public faTrash = faTrash;
  public triangle = faTriangleExclamation;
  public prodCategories: any;
  public btnName: string = 'Add Category';
  public confirmId!: string;
  public edit: boolean = false;
  public displayedColumns: string[] = ['id', 'name', 'date', 'Oprations'];
  public totalRecored: number = 0;
  public dataSource!: MatTableDataSource<any>;
  public dataFromDialog: any;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.frmValidation();
  }

  ngOnInit(): void {
    this.getProductCate()
  }

  frmValidation() {
    this.frmCategories = this.fb.group({
      name: ['', Validators.required]
    })
  }

  get frmControl() {
    return this.frmCategories.controls
  }

  getProductCate() {
    this.productService.getProductCate().subscribe((res) => {
      this.prodCategories = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data(),
        }
      })
      this.dataSource = new MatTableDataSource(this.prodCategories);
      this.dataSource.paginator = this.paginator;
    })
  }

  searchProducts(event: any) {
    event = event.target.value.trim();
    event = event.toLowerCase();
    this.dataSource.filter = event;
  }

  addCategory() {
    if (this.frmCategories.invalid) {
      this.isSubmited = true
      this.toastrService.error('Please fill all details', 'Error');
    }
    else {
      if (this.btnName === 'Add Category') {
        let data = {
          ...this.frmCategories.value,
          dateTime: Date()
        }
        this.productService.addProductCategory(data).then((res: any) => {
          this.frmCategories.reset()
          this.toastrService.success("Recored Added Successfully", 'Success');
          this.isSubmited = false
        }).catch((err: any) => {
          this.toastrService.error(err.message, 'Error')
        })
      }
      else {
        let data = {
          ...this.frmCategories.value,
          dateTime: Date()
        }
        this.productService.updateProductCategory(this.confirmId, data).then((res: any) => {
          this.toastrService.success("Edit Recored Successfully", 'Success')
        })
        this.btnName = 'Add Category'
        this.edit = false
        this.frmCategories.reset()
      }
    }
  }

  editMode(data: any) {
    this.edit = true
    this.confirmId = data.id
    this.frmControl['name'].patchValue(data.name)
    this.btnName = 'Edit Category'
  }

  sendId(id: string) {
    this.confirmId = id
  }

  deleteProductCategory() {
    this.productService.deleteProductCategory(this.confirmId).then((res: any) => {
      this, this.toastrService.success('Delete Recored Succesfully', 'Success')
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error')
    })
  }

  // openDialog() {
  //   this.dialog.open()
  // }

}
