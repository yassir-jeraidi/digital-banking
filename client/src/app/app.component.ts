import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NavbarComponent, NavbarComponent, HlmToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
}
