import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'  //servicio globalizado
})
export class PlacessService {

  public useLocation?: [number,number] ;

  public isLoadingPlaces: boolean = false ;
  public places: Feature[] = [] ;

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor( private placesApi: PlacesApiClient, private mapService: MapService ) {
    this.getUserLocation();
  }

  // get current position del navigator.geolocation no trabaja en base a promesas ni observables, por lo cual se crea una funcion conversa que permita saber cuando se obtiene la geolocalizacion:

  public async getUserLocation(): Promise<[number, number]>{
    return new Promise( (resolve,reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.useLocation = [coords.longitude, coords.latitude] ; // el orden de estos parametros se debe a que mapBox trabaja con ese orden
          resolve(this.useLocation) ;
        },
        (err) => {
          alert('No se pudo obtener la geolocalizacion')
          console.log(err);
          reject();
        }
       );
    });
  }

    getPlacesByQuery( query: string = '') {  
      
    //---------------
    // evita el error de buscar algo en el input de busqueda, se borra y se vuelven a escribir parametros de busqueda
    //https://www.youtube.com/watch?v=wIm8vnHsf70&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=14&ab_channel=FernandoHerrera 7:51
    if(query.length === 0){
      this.places = [] ;
      this.isLoadingPlaces = false;
      return;
    }
    //---------------

    // https://www.youtube.com/watch?v=Vs5TfSMy3uA&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=10&ab_channel=FernandoHerrera
    // https://docs.mapbox.com/playground/geocoding/?search_text=-74.81923920202026,11.000787728852544&limit=1&language=es&access_token=pk.eyJ1IjoidGhhbWFyYW9mYXJyZWwiLCJhIjoiY2wyMnN5bG5jMG45MTNrbzUzZnhzNGFkeiJ9.HsOf4jWskl-mU25ezeLRpg
    // https://www.youtube.com/watch?v=u0HJT_CILh8&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=14&ab_channel=FernandoHerrera 11:03    
    if ( !this.useLocation ) throw Error('No hay userLocation')
    
    this.isLoadingPlaces = true;
    
    this.placesApi.get<PlacesResponse>(`/${query}.json`,{
      params: {
        proximity: this.useLocation.join(',')
      }
    })
    .subscribe( resp => { 
      console.log(resp.features) 
      this.isLoadingPlaces = false;
      this.places = resp.features;
      this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
    });
  }

  deletePlaces() {
    this.places = [];
  }
}
