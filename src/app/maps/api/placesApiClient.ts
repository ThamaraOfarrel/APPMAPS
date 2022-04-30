//https://www.youtube.com/watch?v=u0HJT_CILh8&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=13&ab_channel=FernandoHerrera
//4:25

import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {
    public baseUrl: String = 'https://api.mapbox.com/geocoding/v5/mapbox.places' ;

    constructor(handler: HttpHandler){
        super(handler);
    }

    public override get<T>( url: string, options: {
                                                        params?: HttpParams | {
                                                            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
                                                        };
                                                    }) 
    {

        url = this.baseUrl + url;
        return super.get<T>( url, {
            params: {
                limit: 5,
                languaje: 'es',
                access_token: environment.apiKey,
                ...options.params
            }
        });
    }
}