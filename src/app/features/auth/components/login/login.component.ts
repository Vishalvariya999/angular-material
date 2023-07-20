import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthProvider } from 'firebase/auth';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public isSubmited: boolean = false;
  public hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private meta: Meta
  ) {
    this.validationLogin();

    this.meta.updateTag({
      property: 'og:title',
      content: 'E-commerce Login'
    })

    this.meta.updateTag({
      property: 'og:description',
      content: 'E-commerce Lofin page'
    })


    this.meta.updateTag({
      property: 'og:image',
      content: 'https://images01.nicepagecdn.com/page/14/43/website-template-preview-1443125.jpg'
    })

  }

  ngOnInit(): void { }

  validationLogin() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', Validators.required]
    })
  }

  get frmControl() {
    return this.loginForm.controls;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.isSubmited = true
      this.toastrService.error('Please fill all details', 'Error')
    }
    else {
      this.ngxService.start()
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).then((res: any) => {
        console.log('res-SignInWithCreateAccount :>> ', res);
        if (this.loginForm.value.email === 'admin@gmail.com') {
          localStorage.setItem('role', 'admin')
          this.router.navigate(['/admin/dashboard/home'])
        }
        else {
          localStorage.setItem('role', 'customer')
          localStorage.setItem('email', res.user._delegate.email)
          this.router.navigate(['/customer/dashboard/products'])
        }
        this.ngxService.stop()
        this.toastrService.success("Login Successfully!", 'Success')
      }).catch((err) => {
        this.toastrService.error(err.message, 'Error');
        this.ngxService.stop()
      })
    }
  }

  public googleAuth() {
    this.authService.AuthLogin(new GoogleAuthProvider()).then((res: any) => {
      console.log('res :>> ', res);
      console.log('res?.user?.providerData[0].uid :>> ', res?.user?.providerData[0].uid);
      console.log('res?.user?.providerData[0] :>> ', res?.user?.providerData[0]);
      this.existUser(res?.user?.providerData[0].uid, res?.user?.providerData[0])
      // console.log('res-SignInWithGoogle :>> ', res.user.multiFactor.user.displayName);
      // console.log('res.credential.accessTo ken :>> ', res.user.multiFactor.user.email);
      localStorage.setItem('role', 'customer');
      localStorage.setItem('email', res.user._delegate.email);
      localStorage.setItem('photo_url', res.user._delegate.photoURL);
      this.router.navigate(['/customer/dashboard/products']);
      this.toastrService.success(res.message, 'Success');
    }).catch((err: any) => {
      console.log('err :>> ', err);
    })
  }

  private existUser(uId: any, rowData: any) {
    this.authService.getUsers().subscribe((res: any) => {
      let data = res.map((data: any) => {
        return {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
      });
      console.log('data :>> ', data);
      let exitUser = data.find((response: any) => response.uid === uId);
      console.log('exitUser :>> ', exitUser);
      if (!exitUser) {
        console.log('response :>> ', 1231);
        this.authService.addUser(rowData).then((rec: any) => {
          console.log('rec :>> ', rec);
        }).catch((errr: any) => {
          console.log('errr :>> ', errr);
        })
      }
    });
  }
}
