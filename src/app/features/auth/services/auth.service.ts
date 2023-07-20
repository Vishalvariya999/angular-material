// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData!: AngularFirestoreCollection<any>
  constructor(
    // private http: HttpClient,
    private router: Router,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth
  ) { }

  signUp(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
  }

  signIn(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
  }

  addUser(data: any) {
    return this.angularFirestore.collection('customerDetails').add(data)
  }

  getUsers() {
    return this.angularFirestore.collection('customerDetails').snapshotChanges()
  }

  updateUserProfile(id: any, data: any) {
    return this.angularFirestore.collection('customerDetails').doc(id).update(data)
  }

  AuthLogin(provider: any) {
    return this.angularFireAuth.signInWithPopup(provider)
  }
}
