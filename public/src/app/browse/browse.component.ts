import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  bikes: any = []
  users:any = []
  contact: any = {}
  userEmail: any;
  bikesAll:any = []

  constructor(private _httpService: HttpService,
    private _router:Router,
     private _route:ActivatedRoute, public modalService: ModalService) { }

  ngOnInit(): void {
    let observable = this._httpService.validateUser();
    observable.subscribe( (data: any) => {
      this.userEmail = data.email;
    },
    (error: any) =>{
      this._router.navigate( ['/'] );
    });
    this.displayBikes();
    this.getUsers();
  }


  displayBikes():void{
    let observable = this._httpService.fetchBikes()
    observable.subscribe((data:any) => {
      this.bikes = data.map((bike:any)=>{
        bike.filename= '/assets/images/' + bike.filename;
        return(bike);
      })
      this.bikesAll= this.bikes;
    } )
  }

  getUsers():void{
    let observable = this._httpService.fetchUsers()
    observable.subscribe((data:any) => {
      console.log("Fetching users:", data)
      this.users = data;
    } )
  }

  getContact(event:any):void {
    let id = Number(event.target.name);
    let bike = this.bikes.filter((bike:any) => {return bike.id==id})[0]
    let user = this.users.filter((user:any)=> {return user.email==bike.owner_id})[0]
    this.contact = user;
    console.log(this.contact);
    this.modalService.open('contactInfo')
  }

  delete(event:any):void{
    let id = event.target.name;
    let observable = this._httpService.deleteBike(id)
    observable.subscribe((data:any) => {
     this.ngOnInit();
     console.log('Updating')
    } )

  }

  logout():void{
    let observable = this._httpService.logoutUser();
    observable.subscribe( (data: any) => {
      this._router.navigate( ['/'] );
      console.log('Logging out')
    });

  }


  query(event:any){
    let input = event.target.value;
    this.bikesAll = this.bikes.filter((bike:any)=>{return bike.title.toLowerCase().includes(input.toLowerCase()) })

  }
  


}
