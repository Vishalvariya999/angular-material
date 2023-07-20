import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  // Categories

  getProductCate() {
    return this.angularFirestore.collection('categoryList', ref => ref.orderBy('dateTime', 'desc')).snapshotChanges()
  }

  addProductCategory(data: any) {
    return this.angularFirestore.collection('categoryList').add(data)
  }

  updateProductCategory(id: string, data: any) {
    return this.angularFirestore.collection('categoryList', ref => ref.orderBy('dateTime', 'desc')).doc(id).update(data)
  }

  deleteProductCategory(id: string) {
    return this.angularFirestore.collection('categoryList').doc(id).delete()
  }

  // Products

  getProduct() {
    return this.angularFirestore.collection('products').snapshotChanges()
  }

  getProductCateWise(data: any) {
    return this.angularFirestore.collection('products').ref.where('category', '==', data).get()
  }

  getProductPrice(minPrice: number, maxPrice: number) {
    return this.angularFirestore.collection('products').ref.where('price', '>=', minPrice).where('price', '<=', maxPrice).get()
  }

  getProductDetail(id: any) {
    return this.angularFirestore.collection('products').doc(id).valueChanges()
  }

  addProduct(data: any) {
    return this.angularFirestore.collection('products').add(data)
  }

  updateProduct(id: string, data: any) {
    return this.angularFirestore.collection('products').doc(id).update(data)
  }

  deleteProduct(id: string) {
    return this.angularFirestore.collection('products').doc(id).delete()
  }

  // Cart

  getCartProduct() {
    return this.angularFirestore.collection('cartProducts').snapshotChanges()
  }

  addCartProduct(data: any) {
    return this.angularFirestore.collection('cartProducts').add(data)
  }

  removeCartItem(id: string) {
    return this.angularFirestore.collection('cartProducts').doc(id).delete()
  }

  //Order
  getOrderDetails() {
    return this.angularFirestore.collection('orderDetails').snapshotChanges()
  }

  addOrder(data: any) {
    return this.angularFirestore.collection('orderDetails').add(data)
  }

  perticularOrder(data: any) {
    return this.angularFirestore.collection('orderDetails').ref.where('email', '==', data).get()
  }

  ratingProduct(rate: string) {
    return this.angularFirestore.collection('ratingDetails').ref.where('rating', '==', rate).get()
  }

  addRatingProduct(data: any) {
    return this.angularFirestore.collection('ratingDetails').add(data);
  }
}
