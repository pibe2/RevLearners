import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';

import {Rank} from '../model/rank';
import {User} from '../model/user';
import {LoginCredentialsService} from './login-credentials.service';
import {SessionToken} from '../model/session-token';

import { Router } from '@angular/router';
import {Observable} from "rxjs/Observable";

@Injectable()
export class BackendService implements OnInit {
    ranks: Rank[];
    user: User;
    token: SessionToken = null;
    headers: HttpHeaders;

    constructor(private http: HttpClient, private creds: LoginCredentialsService,
        private rout: Router) {
        this.user = this.creds.getUser();
        this.token = this.creds.getToken();
    }

    ngOnInit() {
        if (!this.creds.isLoggedIn()) {
            this.rout.navigate(['401']);
        }
        else {
            this.headers = this.creds.prepareAuthHeaders();
        }
    }

    public createMessage(sender: number, receiver: number, title: string, body: string, files: FormData){
        console.log(sender, receiver, title, body);
        return this.http.post('http://localhost:8085/api/rest/messages/create', { senderId: sender, receiverIds: [receiver], title: title, contents: body}, { headers: this.creds.prepareAuthHeaders()});
    }

    public createCertification(user: number, certification: number, files: FormData){
        return this.http.post('http://localhost:8085/api/rest/user_certifications/create', { user, certification, files }, { headers: this.creds.prepareAuthHeaders()});
    }

    public getCerts() {
        return this.http.get('http://localhost:8085/api/rest/certifications/getList', { headers: this.creds.prepareAuthHeaders()});
    }

    public getUsers() {
        console.log(this.token);
        return this.http.get('http://localhost:8085/api/rest/users/getList', { headers: this.creds.prepareAuthHeaders()});
    }

    public getTopics(): Observable<any[]> {
        console.log(this.token);
        return this.http.get<any[]>('http://localhost:8085/api/rest/topics/getList', {headers: this.creds.prepareAuthHeaders()});
    }

    public getMessages() {
        console.log(this.token);
        return this.http.get(`http://localhost:8085/api/rest/messages/getAllMessages/${this.user.id}`, {headers: this.creds.prepareAuthHeaders()});
    }

    public getNotifications() {
        return this.http.get('http://localhost:8085/api/rest/notifications/getList', {headers: this.creds.prepareAuthHeaders()});
    }

}
