import {ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(withHttpTransferCacheOptions({includePostRequests: true})),
    provideExperimentalZonelessChangeDetection()
  ]
};
