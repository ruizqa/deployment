import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  bikes={};

  constructor(private _http: HttpClient) { }

  fetchBikes(): any{
    return this._http.get( "api/bikes" );
  }
  fetchMyBikes(data:any): any{
    return this._http.post( "api/myBikes",data );
  }

  fetchUsers(): any{
    return this._http.get( "api/users" );
  }

  createUser( newUser: any ): any {
    return this._http.post( "/api/users", newUser )
  }

  createBike( newBike: any ): any {
    return this._http.post( "/api/bikes", newBike )
  }

  updateBike( newBike: any, id:any ): any {
    return this._http.put( `/api/bikes/${id}`, newBike )
  }

  deleteBike(id:any):any{
    return this._http.delete(`/api/bikes/delete/${id}`)

  }

  loginUser( currentUser: any ){
    return  this._http.post( "/api/users/login", currentUser );
  }

  uploadImage( file: any ){
    return  this._http.post( "/api/upload", file );
  }

  validateUser(): any {
    return this._http.get( "/api/users/validate" );
  }

  logoutUser(): any {
    return this._http.get( '/api/users/logout' );
  }


}
