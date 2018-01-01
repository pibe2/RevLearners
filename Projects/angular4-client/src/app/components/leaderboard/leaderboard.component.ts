import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../../model/user';
import { Topic } from '../../model/topic';

import { LoginCredentialsService } from '../../services/login-credentials.service';
import { BackendService } from '../../services/backend.service';

import { AUTHORIZATION_HEADER, TOKEN_HEADER, SessionToken } from '../../model/session-token';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  user: User;

  userScore: {
    topic: Topic,
    user: User,
    score: number
<<<<<<< HEAD
  }
=======
  };
>>>>>>> 354e064b0781ae8a81df6ea13fea382aa91c90bf

  //userScores = userScore[];

  users: User[];
  public topics = []
  selectedTopic = 'Core Java';

  token: SessionToken = null;

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private validate: LoginCredentialsService, private dataservice: BackendService) { }

  ngOnInit() {
    console.log("IS THERE A TOKEN?")
    console.log(this.token);

    this.user = this.validate.getUser();
    this.token = this.validate.getToken();
    if (this.user != null && this.token != null) {
      this.headers = this.headers.append(AUTHORIZATION_HEADER, this.token.username);
      this.headers = this.headers.append(TOKEN_HEADER, this.token.token);
      this.dataservice.getTopics().subscribe(
        (data: any) => {
          this.topics = data;
          console.log("Topic Data");
          console.log(data);
        }
      )

      this.dataservice.getUsers().subscribe(
        (data: any) => {
          this.users = data;
          console.log("Data: " + data);
          console.log(data);
        }
      )
    }
    console.log("Current User:");
    console.log(this.user);


  }

  submit(value){
    this.selectedTopic = value;
  }

}
