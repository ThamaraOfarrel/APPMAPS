import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// -1- Mathbox
// https://www.mapbox.com/
// https://www.youtube.com/watch?v=cqE9owJo_kw&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=6&ab_channel=FernandoHerrera
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbWFyYW9mYXJyZWwiLCJhIjoiY2wyMnN5bG5jMG45MTNrbzUzZnhzNGFkeiJ9.HsOf4jWskl-mU25ezeLRpg';
// -0- Mathbox

if ( !navigator.geolocation ){
  alert('Navegador no soporta la geolocalizacion');
  throw new Error('Navegador no soporta la geolocalizacion')
}

if (environment.production) { // aqui se renderiza la aplicacion
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
