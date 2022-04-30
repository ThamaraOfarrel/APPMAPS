import { Component} from '@angular/core';
import { PlacessService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer ?: NodeJS.Timeout;  // error: https://www.youtube.com/watch?v=mt0pMPwgHhc&list=PLCKuOXG0bPi0RHirEQB7GJgpfW-Q5m-Xu&index=12&ab_channel=FernandoHerrera 2:35
  
  constructor(private placesService: PlacessService) { }

  onQueryChanged( query: string = '' ) {
    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );
    
    this.debounceTimer = setTimeout(
      () => {
        this.placesService.getPlacesByQuery(query);
      }
    ,1000 );
  }

}
