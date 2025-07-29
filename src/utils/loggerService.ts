import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const logger = new CustomLogger('AppRoot', 'hotpink');

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly serverLogUrl = '/api/logs'; // URL del endpoint del servidor para recibir logs

  constructor(
    private readonly http: HttpClient
  ) {}

  logServer(message: string): void {
    logger.log(message);
    this.http.post(this.serverLogUrl, { message }).subscribe(); // Enviar log al servidor
  }
}
