import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleAuthUrl } from '../../data/googleauthurl';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  private apiUrl = environment.apiUrl;

  oAuthParams: HttpParams = new HttpParams();

  constructor(private http: HttpClient) { }

  getGoogleAuthUrl(): Observable<GoogleAuthUrl> {
    return this.http.get<GoogleAuthUrl>(`${this.apiUrl}/googleAuthUrl`);
  }
}