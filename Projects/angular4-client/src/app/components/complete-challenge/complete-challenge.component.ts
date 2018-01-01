import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionOption } from '../../model/question-option';
import { Question } from '../../model/question';
import { ChallengeAttempt } from '../../model/challenge-attempt';
import { Challenge } from '../../model/challenge';
import { LoginCredentialsService } from '../../services/login-credentials.service';
import { SessionToken } from '../../model/session-token';

@Component({
    selector: 'app-complete-challenge',
    templateUrl: './complete-challenge.component.html',
    styleUrls: ['./complete-challenge.component.css']
})
export class CompleteChallengeComponent implements OnInit {

    token: SessionToken;
    attempt: ChallengeAttempt;

    constructor(private credentialsService: LoginCredentialsService, private questionService: QuestionService,
        private router: Router, private activatedRoute: ActivatedRoute) {
    }

    submitAttempt(): void {
        // todo: validate new attempt?
        this.questionService.submitAttempt(this.attempt).subscribe(
            (result: ChallengeAttempt) => {
                this.router.navigate([`/reviewChallenge/${result.id}`]);
            },
            console.log
        );
    }

    selectOption(option: QuestionOption, question: Question) {
        for (const opt of question.options) {
            opt.isCorrect = false;
        }
        option.isCorrect = true;
    }

    ngOnInit() {
        this.token = this.credentialsService.getToken();
        if (this.token != null) {
            this.activatedRoute.params.subscribe(params => {
                console.log(params);
                const id: number = +(params['id']);
                this.questionService.getChallengeById(id).subscribe(
                    (challenge: Challenge) => {
                        this.attempt = new ChallengeAttempt(
                            1, this.credentialsService.getUser(), challenge, 0, []
                        );
                    },
                    console.log
                );
            });
        }
    }
}

