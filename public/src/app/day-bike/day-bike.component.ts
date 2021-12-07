import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-day-bike',
  templateUrl: './day-bike.component.html',
  styleUrls: ['./day-bike.component.css']
})
export class DayBikeComponent implements OnInit {

  bikes: any = []
  bike:any;
  show=false;

  constructor(private _httpService: HttpService,
    private _router:Router,
     private _route:ActivatedRoute, public modalService: ModalService) { }

  ngOnInit(): void {
    this.getBikes();
    

  }


  getBikes():void{
    let observable = this._httpService.fetchBikes()
    observable.subscribe((data:any) => {
      this.bikes = data.map((bike:any)=>{
        bike.filename= '/assets/images/' + bike.filename;
        return(bike);
      })
      console.log('bikes', this.bikes);
      this.showRandom();
    } )
  }

  showRandom():void{
    if(Number(this.bikes.length)>0){
    let number = Math.floor(Math.random() * Number(this.bikes.length));
    this.bike = this.bikes[number]
    this.show=true}
  }









  

}
