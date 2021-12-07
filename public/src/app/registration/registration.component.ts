import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  regUser:any;
  newError: boolean = false;
  error:any;

  constructor(private _httpService: HttpService,
              private _router:Router,
               private _route:ActivatedRoute) { }

  ngOnInit(): void {
    this.resetNewUser()
  }

  resetNewUser(){
    this.regUser = { firstName:"", lastName:"", email: "", password: "", cpassword:"" }
  }

  register(event:any):void {
    event.preventDefault();
    console.log(this.regUser);
    let observable = this._httpService.createUser(this.regUser);
    observable.subscribe( (data: any ) => {
      console.log(data)
      this._router.navigate( ['/browse'] );
    },
    ( error: any ) => {
      console.log( error );
      this.newError = true;
      this.error = error.statusText;
    });
    
  }
}
