import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { HeaderServiceService } from 'src/app/shared/services/header-service.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  public editMode: boolean = false;
  public fetching: string = 'Update';
  public userData: any;
  public loginUserId: any;
  public frmEditData!: FormGroup;
  public hide: boolean = true;
  public profile_image!: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private headerServices: HeaderServiceService
  ) {
    this.fromVali()
    this.loginUserId = localStorage.getItem('email')
    this.headerServices.cartIcon.next(true);
    this.headerServices.profileIcon.next(true);
    this.profile_image = localStorage.getItem('photo_url') ? localStorage.getItem('photo_url') : 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=';
  }

  ngOnInit(): void {
    this.getUserDetails()
  }

  fromVali() {
    this.frmEditData = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  getUserDetails() {
    this.authService.getUsers().subscribe((res: any) => {
      console.log('res :>> ', res);
      this.userData = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      })
      console.log('this.userData-55 :>> ', this.userData);
      this.userData.filter((rec: any) => {
        if (rec.email === this.loginUserId) {
          this.userData = rec
        }
      })
      console.log('this.userData-61 :>> ', this.userData);
    })
  }

  changeMode() {
    this.editMode = true;
    this.frmEditData.patchValue({
      ...this.userData
    })
  }

  cancleEditMode() {
    this.editMode = false
  }

  updateProfile() {
    const data = {
      ...this.frmEditData.value
    }
    this.authService.updateUserProfile(this.userData.id, data).then((res: any) => {
      this.toastrService.success("Edit recored successfully!", 'Success')
      this.editMode = false
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error')
      this.editMode = false
    })
  }

}
