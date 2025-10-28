import { Component } from '@angular/core';
import { User } from './models/old/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISLA Immo';
  user?: User
  fetchUserIsLoading = false
}
