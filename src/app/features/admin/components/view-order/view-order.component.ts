import { Component, OnInit } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  public orders: any
  public faEye = faEye
  public viewOrder: boolean = false
  public viewOrderEmail: any
  public orderData: any
  public tblHeader: string[] = ['Id', 'Date', 'Name', 'Email', 'Phone', 'Payment', 'Amount', 'Operation']

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.productService.getOrderDetails().subscribe((res: any) => {
      this.orders = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      });
    });
  }

  viewOrderItem(data: any) {
    this.viewOrder = true
    this.productService.perticularOrder(data).then((res: any) => {

      this.orderData = res.docs.map((data: any) => {
        return {
          ...data.data()
        }
      });
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error');
    });
  }
}
