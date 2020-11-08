import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-music-genre-recognition';
  isActive = false;
  constructor(private router: Router) { }



  toggleMenu() {
    this.isActive = !this.isActive;
}


}