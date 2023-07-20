import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {
  cartIcon = new Subject<boolean>();
  profileIcon = new Subject<boolean>();
  constructor(
    private angularFireAuth: AngularFireAuth
  ) { }

  logout() {
    return this.angularFireAuth.signOut()
  }
}
