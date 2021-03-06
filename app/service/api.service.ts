import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cache, Common} from 'backlive/utility';

@Injectable()
export class ApiService {
    private TOKEN_CACHE_KEY: string = 'API_TOKEN';
    
    private http: Http;
    private token: string;
    
    get baseUrl(): string { return '/api/' };
    get AuthorizationHeader(): { [key: string] : string }  { return this.getAuthorizatioHeader() };
    
    constructor(http: Http) {
        this.http = http;
    }
    
    setToken(token: string) {
        this.token = token;
        
        if(token == null) {
            Cache.remove(this.TOKEN_CACHE_KEY);
        }
        else {
            Cache.flush();
            Cache.set(this.TOKEN_CACHE_KEY, this.token, 86400 * 30); //30 day token
        }
    }
    
    getToken() {
        return this.token;
    }
    
    get(endpoint: string, data: any = null): Observable<Response> {
        var requestId = Common.uniqueId();
        endpoint = this.buildQueryString(endpoint, data);
               
        return this.execute(new ApiRequest(this.http, this.baseUrl + endpoint,
        { 
            headers: this.getHeaders(),
            method: RequestMethod.Get
        }));
    }
    
    post(endpoint: string, data: any): Observable<Response> {
        return this.execute(new ApiRequest(this.http, this.baseUrl + endpoint,
        {
            headers: this.getHeaders(),
            method: RequestMethod.Post,
            body: JSON.stringify(data)
        }));
    }
    
    put(endpoint: string, id: string, data: any): Observable<Response> {
        return this.execute(new ApiRequest(this.http, this.baseUrl + endpoint + '?id=' + id,
        {
            headers: this.getHeaders(),
            method: RequestMethod.Put,
            body: JSON.stringify(data)
        }));
    }
    
    delete(endpoint: string): Observable<Response> {
        return this.execute(new ApiRequest(this.http, this.baseUrl + endpoint,
        {
            headers: this.getHeaders(),
            method: RequestMethod.Delete
        }));
    }
    
    load(endpoint: string, data: any = null) {
        endpoint = this.buildQueryString(endpoint, data);
        Common.log('API LOAD: ', endpoint);
        window.location.href = this.baseUrl + endpoint + (data ? '&' : '?') + 'authtoken=' + encodeURIComponent(this.token);
    }
    
    private buildQueryString(endpoint: string, data: any) {
        if(data != null) {
            var qs = "";
            
            for(var key in data) {
                qs += '&'.concat(key, '=', data[key]);
            }
            
            endpoint += '?' + qs.substring(1);
        }
        
        return endpoint;
    }
    
    private getAuthorizatioHeader(): { [key: string] : string } {
        return { 'Authorization': 'Basic ' + this.token };
    }
    
    private getHeaders(contentType: string = 'application/json') {
        var headers = new Headers();
        
        if(contentType) {
            headers.append('Accept', contentType);
            headers.append('Content-Type', contentType);
        }
        
        if(!this.token) {
            this.token = Cache.get(this.TOKEN_CACHE_KEY);
        }
        
        if(this.token) {
            headers.append('Authorization', 'Basic ' + this.token);
        }
        
        return headers;
    }
    
    private execute(request: ApiRequest): Observable<Response> {
        var observable: Observable<Response> = request.execute();
        observable['request'] = request;
        return observable;
    }
}

class ApiRequest {
    service: Http;
    url: string;
    options: RequestOptionsArgs;
    
    startTime: number;
    
    constructor(service: Http, url: string, options: RequestOptionsArgs) {
        this.service = service;
        this.url = url;
        this.options = options;
    }
    
    execute() : Observable<Response> {
        this.startTime = new Date().getTime();
        return this.service.request(this.url, this.options);
    }
    
    complete() {
        var duration = new Date().getTime() - this.startTime;
        Common.log('API ' + this.options.method, this.url, this.options.body ? this.options.body : '', '- duration', duration, 'ms');
    }
}