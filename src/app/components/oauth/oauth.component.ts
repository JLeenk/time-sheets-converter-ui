import { Component } from '@angular/core';
import { OauthService } from '../../services/oauth/oauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'oauth',
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css'
})
export class OauthComponent {
  private googleAuthUrl: string = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    'response_type=code&' +  // Ask for authorization code, not tokens
    'client_id=141858402827-lcglt1nf4bpejs5h3fork2ouqpo5ungt.apps.googleusercontent.com&' +  // Replace with your Google Client ID
    'redirect_uri=http://localhost:8080/oauth/callback&' +  // Backend URL
    'scope=https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/userinfo.email&' +  // Multiple scopes (Google Drive and Email)
    'access_type=offline&' +  // Offline access to get refresh token
    'prompt=consent';  // Ensure consent is requested

  constructor(private oauthService: OauthService, private router: Router) {
  }

  // This method will redirect the user to Google’s OAuth 2.0 endpoint
  redirectToGoogle() {
    // window.location.href = this.googleAuthUrl

    this.oauthService.getGoogleAuthUrl().subscribe({ 
      next: resp => window.location.href = resp.url, 
      error: err => this.router.navigate([''], {queryParams: {'failMessage': 'Fail on the server'}}) 
    });
  }
}
