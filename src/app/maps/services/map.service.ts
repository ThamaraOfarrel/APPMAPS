import { Injectable } from '@angular/core';

import { DirectionsApiClient } from '../api';

import { DirectionsResponse, Route } from '../interfaces/directions';
import { Feature }                   from '../interfaces/places';

import { Map, LngLatLike, Marker, Popup, LngLatBounds, AnySourceData} from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private map?: Map;
  private markers: Marker[] = [] ;

  constructor( private directonsApi: DirectionsApiClient ) { }

  get isMapReady(){
    return !!this.map;
  }

  setMap(map:Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');
    
    this.map?.flyTo({
      zoom:14,
      center: coords
    });
  }

  createMarkersFromPlaces( places: Feature[], userLocation: [number, number]) {
    if(!this.map) throw Error('Mapa no inicializado');

    //-----------------------------------
    // permite quitar el menu de lugares para visualizar mejor el mapa
    this.markers.forEach( marker => marker.remove() );   
    const newMarkers= [];
    //-----------------------------------

    for (const place of places) {  
      const [ lng, lat ] = place.center;
      const popup = new Popup()
        .setHTML(`
        <h6>${ place.text }</h6>
        <span>${ place.place_name }</span>`)
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup( popup )
        .addTo( this.map );

      newMarkers.push( newMarker );
    }
    this.markers = newMarkers ;

    if( places.length === 0 ) return ;

    const bounds = new LngLatBounds();
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ) );
    bounds.extend( userLocation );

    this.map.fitBounds(bounds, {
      padding: 200
    });
  }

  getRouteBetweenPoints( start: [number, number], end: [number, number] ) {
    this.directonsApi.get<DirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`)
      .subscribe( resp => this.drawPoliline(resp.routes[0]));
  }
  
  private drawPoliline( route: Route) {
    console.log({kms: route.distance / 1000, duration: route.duration / 60});  // distancia en km y duracion en minutos

    if( !this.map ) throw Error('Mapa no inicializado') ;

    const coords= route.geometry.coordinates ;

    const bounds = new LngLatBounds();
    coords.forEach( ([lng, lat]) => {
      bounds.extend( [lng, lat] );
    });

    this.map?.fitBounds( bounds, {
      padding: 200
    });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    if( this.map.getLayer('RouteString') ) {  // este if permite que al momento de cambiar de direccion a otro lugar resultante, no salga el error de que ya existe un elemento con ese id 
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData) ;

    this.map.addLayer({
      id: 'RouteString', 
      type: 'line',
      source: 'RouteString', 
      layout: {
        'line-cap':'round',
        'line-join':'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    })
  }
}
