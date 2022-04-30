import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map, Popup, Marker} from 'mapbox-gl';
import { MapService, PlacessService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef ;   // https://www.youtube.com/watch?v=cqE9owJo_kw&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=6&ab_channel=FernandoHerrera  9:17

  constructor(private PlacessService:PlacessService, private mapService: MapService) { }

  ngAfterViewInit(): void {
    if( !this.PlacessService.useLocation) throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.PlacessService.useLocation, // starting position [lng, lat]
      zoom: 14 // starting zoom
      });

    const popup = new Popup()
    .setHTML(
      `<h6>Aqui Estoy</h6>
      <span>Estoy en este lugar del mundo</span>`
    );
    
    new Marker({color:'red'})
    .setLngLat(this.PlacessService.useLocation)
    .setPopup(popup)
    .addTo(map)

    this.mapService.setMap(map);
  }

}
