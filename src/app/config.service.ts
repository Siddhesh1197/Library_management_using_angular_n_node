import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from './config.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Configuration;

  constructor(private http: HttpClient) { }

  load(url){
    console.log("Inside LOAD: ", url)
    return new Promise(resolve => {
      this.http.get(url).pipe(map((res: any) => res))
      .subscribe(config => {
        this.config = config;
        resolve();
      });
    });
  }

  getConfiguration(): Configuration {
    console.log("Inside getConfiguration---------> ",this.config);
    return this.config;
  }
}
