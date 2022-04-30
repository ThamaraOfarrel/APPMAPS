//https://www.youtube.com/watch?v=u0HJT_CILh8&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=13&ab_channel=FernandoHerrera
//4:25

import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {
    public baseUrl: String = 'https://api.mapbox.com/directions/v5/mapbox/driving' ;

    constructor(handler: HttpHandler){
        super(handler);
    }

    public override get<T>( url: string ) {

        url = this.baseUrl + url;
        return super.get<T>( url, {
            params: {
                alternatives: false,
                geometries: 'geojson',
                language: 'en',
                overview: 'simplified', 
                steps: true, 
                access_token: environment.apiKey
            }
        });
    }
}