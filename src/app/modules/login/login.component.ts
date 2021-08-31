import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup ;
  public loginInvalid: boolean;
  isLoggedIn = true;
  errorMessage = '';
  isCheckingLogin:boolean= false;
  isLoginFailed = false;
  roles: string[] = [];


  constructor(private tokenStorage: TokenStorageService, private authService: AuthService,private fb: FormBuilder, private router: Router) { }

  isAuthenticated: boolean
  showWait:boolean=false;

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required])});

      if(this.tokenStorage.getToken()!=null){
        this.isAuthenticated=true;
        this.router.navigate(['/dashboard']);   
      }          
  }


  onSubmit(formValue: any) {
    this.showWait=true;
    this.isLoginFailed = false;

    var data ={username:formValue.username,password:formValue.password};

    this.authService.login(data).subscribe(
      data => {    
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.loginInvalid = false;
        this.roles = this.tokenStorage.getUser().roles.split(';');

        this.reloadPage()        
      },
      err => {
        this.loginInvalid = true;
       this.showWait=false;
        console.error(err);
      }
    );
  }

  reloadPage() {
    
    window.location.reload();  
     
  }
}
