import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { apiHost, apiPrefix } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = `${apiHost}${apiPrefix}`;  

  constructor(
    private http:HttpClient
  ) { }

  public getHttp<T>(operation:string) {   
    return this.http.get<T>(`${this.apiUrl + operation}`);
  }

  public postHttp<T>(operation:string, body:any = null){    
    return this.http.post<T>(`${this.apiUrl + operation}`, body);
  }

  public putHttp<T>(operation:string, body:any = null){    
    return this.http.put<T>(`${this.apiUrl + operation}`, body);
  }

  public deleteHttp<T>(operation:string, body:any = null){    

    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body,
    };
    
    return this.http.delete<T>(`${this.apiUrl + operation}`, options);
  }
  
  public getHttpBlob(operation:string) {
    return this.http.get(`${this.apiUrl + operation}`, { responseType: 'blob'});    
  }

  public postHttpBlob(operation:string, body:any = null) {
    return this.http.post(`${this.apiUrl + operation}`, body, { responseType: 'blob'});    
  }

  public postFormHttp<T>(operation:string, body?:FormData){
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<T>(`${this.apiUrl + operation}`, body, {headers});
  }
  
}
