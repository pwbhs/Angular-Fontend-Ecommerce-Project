import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  // inject OktaAuthService
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }
  
  // Will intercept all outgoing HTTP requests of HttpClient
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return from(this.handleAccess(request, next));
  }


  private async handleAccess(request: any, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // Only add an access token for secured endpoint
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    if (securedEndpoints.some(url => request.urlWithPatams.includes(url))) {

      // get access token
      const accessToken = await this.oktaAuth.getAccessToken();
    
      // clone the request and add new header with access token
      request = request.clone({
        setHeader: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      return await lastValueFrom(next.handle(request)); //continue other interceptors in the chain.
      //If there are no interceptors , make the call to REST API
    }

  }

}


