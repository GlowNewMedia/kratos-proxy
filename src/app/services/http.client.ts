import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'ng2-cookies';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpClient {
    /**
     * A listener for all request errors
     * @property errors
     */
    public static errors: Subject<any> = new Subject<any>();

    /**
     * A listener for post success
     * @property success
     */
    public static success: Subject<any> = new Subject<any>();

    /**
     * The authorization cookie name
     * @property cookieName
     */
    private static cookieName: string = "auth_token";

    constructor(private http: Http, private cookieService: CookieService) {}

    /**
     * Sends login request
     * @param email
     * @param password
     * @return {Promise<boolean>}
     * @method login
     * @owner Http
     */
    login(email: string, password: string): Promise<boolean> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');

        return this.http.post('/oauth2/token', `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&grant_type=password`, headers)
            .toPromise().then((res: any) => {
                var data = res.json();
                if (data.access_token) {
                    let cookie: string = data.access_token;
//                    TODO Set cookie
                    let date = new Date();
                    date.setDate(date.getDate() + 7);

                    this.cookieService.set(HttpClient.cookieName, cookie, date);
                } else {
//                    TODO Remove cookie
                    this.cookieService.delete(HttpClient.cookieName);
                }

                return !!this.getToken();
            }).catch(this.catchError);
    }

    /**
     * Removes the auth token cookie
     */
    logout() {
        if (!!this.getToken()) {
            this.cookieService.delete(HttpClient.cookieName);
        }
    }

    /**
     * Gets url with authorization header attached
     * @param url
     * @return {Promise<T>}
     * @method get
     * @owner Http
     */
    get<T>(url: string, asJson: boolean = true): Promise<T> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.get(url, { headers: headers }).toPromise().catch(this.catchError).then((res: any) => {
            if (asJson) {
                return res.json() as T;
            } else {
                return res.text() as T;
            }
        });
    }

    /**
     * Posts to url with authorization header attached
     * @param url
     * @param data: Object Data
     * @return {Promise<T>}
     * @method get
     * @owner Http
     */
    post<T>(url: string, data: any): Promise<T> {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.post(url, data, { headers: headers }).toPromise().catch(this.catchError).then(
            (res: any) => {
                HttpClient.success.next(res);

                return res.json() as T;
            });
    }

    // Helper methods

    /**
     * Creates the authorization header
     * @param headers
     * @method createAuthorizationHeader
     * @owner Http
     */
    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
        let token = this.getToken();
        if (token != null) {
            headers.append('Authorization', `Bearer ${token}`);
        }
    }

    /**
     * Gets the authorization cookie
     * @return {string}
     * @method getToken
     * @owner Http
     */
    getToken(): string {
        return this.cookieService.get(HttpClient.cookieName);
    }

    /**
     * Logs any http errors
     * @param error
     * @method catchError
     * @owner Http
     */
    private catchError(error: any) {
        let errMsg = (error.message)
            ? error.message
            : error.status ? `${error.status} - ${error.statusText}` : `Uknown Error`;

        console.error("An error occured trying to load this request, please try again later.", errMsg);

        HttpClient.errors.next(error);

        return Promise.reject(errMsg);
    }
}