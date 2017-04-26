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

    constructor(private http: Http) {}

        /**
     * Gets url with authorization header attached
     * @param url
     * @return {Promise<T>}
     * @method get
     * @owner Http
     */
    get<T>(url: string, asJson: boolean = true): Promise<T> {
        const headers = new Headers();
        this.createHeader(headers);

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
        const headers = new Headers();
        this.createHeader(headers);

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
    createHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
    }

    /**
     * Logs any http errors
     * @param error
     * @method catchError
     * @owner Http
     */
    private catchError(error: any) {
        const errMsg = (error.message)
            ? error.message
            : error.status ? `${error.status} - ${error.statusText}` : `Uknown Error`;

        console.error('An error occured trying to load this request, please try again later.', errMsg);

        HttpClient.errors.next(error);

        return Promise.reject(errMsg);
    }
}
