import {Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css']
})
export class MyListingsComponent implements  OnInit {
  bike:any;
  newError: boolean = false;
  error:any=[];
  errors:any=[];
  editError:any;
  myBikes:any=[];
  userEmail:any;
  ready:boolean =false;
  newImage :any;
  editfileName = "";
  fileName="";

  constructor(private _httpService: HttpService,
              private _router:Router,
               private _route:ActivatedRoute) { }

    ngOnInit(): void {

   
    let observable = this._httpService.validateUser();
    observable.subscribe( (data: any) => {
      console.log(data.email,data)
      this.userEmail = data.email
      this.resetNewBike();
      this.displayMyBikes();
    },
    (error: any) =>{
      this._router.navigate( ['/'] );
    });
    
  }

  resetNewBike(){
    this.bike = { title: "", description: "", location:"", price:"", owner_id:this.userEmail }
  }

  create(event:any):void {
    event.preventDefault();
    if (!this.newImage) {
      this.newError = true;
      this.error = "Please select an image of the bike in an appropriate format (.jpg, .jpeg or .png)";
      return;
    }
    this.bike.price = Number(this.bike.price)
    const createForm = new FormData();
    Object.keys(this.bike).forEach(key => createForm.append(key, this.bike[key]));
    createForm.append('image', this.newImage)
    createForm.forEach(value=> console.log(value));
    let observable = this._httpService.createBike(createForm);
    observable.subscribe( (data: any ) => {
      this.displayMyBikes();
    },
    ( error: any ) => {
      console.log( error );
      this.newError = true;
      this.error = error.statusText;
    });
    
  }

  displayMyBikes():void{
    let data = {email:this.userEmail}
    let observable = this._httpService.fetchMyBikes(data)
    observable.subscribe((data:any) => {
      this.myBikes = data.map((bike:any)=> {
        bike.filename = '/assets/images/' + bike.filename 
        bike.editfileName = '';
        return (bike)
      })
      this.errors = Array(this.myBikes.length).fill("")
      this.editError = Array(this.myBikes.length).fill(false);
      this.ready=true;
    } )
  }

  update(event:any):void {
    event.preventDefault();
    let id = Number(event.target.name);
    let bike = this.myBikes.filter((bike:any) =>bike['id'] == id)[0]
    let index = this.myBikes.indexOf(bike);
    if (!bike.image) {
      this.editError[index] = true;
      this.errors[index] = "Please include an image of the bike in an appropriate format (.jpg, .jpeg or .png)";
      return;
    }
    
    bike.price = Number(bike.price)
    bike.owner_id = this.userEmail;
    const updateForm = new FormData();
    console.log(bike)
    Object.keys(bike).forEach(key => updateForm.append(key, bike[key]));
    updateForm.forEach(value=> console.log(value));
    let observable = this._httpService.updateBike(updateForm,id);
    observable.subscribe( (data: any ) => {
      this.myBikes[index]=data;
      this.editError[index]=false;
      this.errors[index] = "";
    },
    ( error: any ) => {
      console.log( error );
      this.editError[index]=true;
      this.errors[index] = error.statusText;
    });
    
  }

  OnNewImageSelect(event:any) {
    if(event.target.files[0].type == "image/png" || event.target.files[0].type == "image/jpg" || event.target.files[0].type == "image/jpeg" ){
      this.newImage = event.target.files[0]
      this.fileName = this.newImage.name

    }
    else{
      this.newError = true;
      this.error = "Please upload an image file (.jpeg, .jpg or .png)"
    }
    
  }
  OnEditImageSelect(event:any, id:any) {
    console.log(id)
    let index = Number(id);
    let bike = this.myBikes[index]
    console.log("files: ", event.target.files, "bike", bike)
    if(event.target.files[0].type == "image/png" || event.target.files[0].type == "image/jpg" || event.target.files[0].type == "image/jpeg" ){
      bike.image = event.target.files[0]
      bike.editfileName = bike.image.name
      console.log('edited bike', bike)
    }
    else{
      this.editError[index]=true;
      this.errors[index] = "Please upload an image file (.jpeg, .jpg or .png)"

    }
    
  }


  logout():void{
    let observable = this._httpService.logoutUser();
    observable.subscribe( (data: any) => {
      this._router.navigate( ['/'] );
      console.log('Logging out')
    });

  }

}
