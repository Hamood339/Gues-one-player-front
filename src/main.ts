import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {AppComponent} from './app/app';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideNoopAnimations()
  ]
}).catch(err => console.error(err));
