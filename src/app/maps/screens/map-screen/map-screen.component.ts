import { Component } from '@angular/core';
import { PlacessService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent {

  constructor(private PlacessService:PlacessService) {}

  get isUserLocationReady() {
    return this.PlacessService.isUserLocationReady;
  }

}
