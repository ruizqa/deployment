import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:any;
  newError: boolean = false;
  error:any;

  constructor(private _httpService: HttpService,
              private _router:Router,
               private _route:ActivatedRoute) { }

  ngOnInit(): void {
    this.resetNewUser()
  }

  resetNewUser(){
    this.user = { email: "", password: "" }
  }

  login(event:any):void {
    event.preventDefault();

    let observable = this._httpService.loginUser(this.user);
    observable.subscribe( (data: any ) => {
      this._router.navigate( ['/browse'] );
    },
    ( error: any ) => {
      console.log( error );
      this.newError = true;
      this.error = error.statusText;
      console.log("Printing",this.newError,this.error)
    });
    
  }

}
