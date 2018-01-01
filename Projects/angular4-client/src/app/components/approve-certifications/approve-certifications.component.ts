import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {User} from '../../model/user';
import {Certification} from '../../model/certification';

import {LoginCredentialsService} from '../../services/login-credentials.service';
import {AuthenticationService} from '../../services/authentication.service';
import {SessionToken} from '../../model/session-token';
import {HttpHeaders} from '@angular/common/http';

import {AUTHORIZATION_HEADER, TOKEN_HEADER} from '../../model/session-token';


@Component({
  selector: 'app-approve-certifications',
  templateUrl: './approve-certifications.component.html',
  styleUrls: ['./approve-certifications.component.css']
})
export class ApproveCertificationsComponent implements OnInit {

  token: SessionToken;
  cert: Certification;
  user: User;
  

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private lcs: LoginCredentialsService, private rout: Router) { }

  ngOnInit() {
    this.token = this.lcs.getToken();
    if (this.token != null) { }
    else {
      this.rout.navigate(["401"]);
    }
  }

  fetchAllCert(): Observable<Certification> {
    let url = `http://localhost:4200/api/rest/certification/getList/`;
    return this.http.get(url, { headers: this.headers })
      .map((res: Response) => {
        return res.json().results.map(item => {
          return new Certification(
            item.id,
            item.name,
            item.topic,
            item.user,
            item.status
          );
        });
      });
  }

}

