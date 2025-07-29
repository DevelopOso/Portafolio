import { afterNextRender, afterRender, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoggingService} from "./Utils/loggerService";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'portfolioWebDevelopOso';

  constructor(
    private readonly loggingService: LoggingService
  ) {
    afterNextRender(() => {
      const message = 'After next render';
      this.loggingService.logServer(message);
    });

    afterRender(() => {
      const message = 'After render';
      this.loggingService.logServer(message);
    });
  }
}
