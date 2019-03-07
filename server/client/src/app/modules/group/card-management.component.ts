import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupService, UserService } from '../../shared';

@Component({
    selector: 'card-management',
    templateUrl: './card-management.component.html',
    styleUrls: ['./card-management.component.css']
})
export class CardManagementComponent {
    user = this.userService.getAuthenticatedUser();
    group = {};
    groupID = 0;
    cardID = '';
    cardTitle = '';
    cardDescription = '';
    cardOwner = [];
    validation = [];

    title = '';
    alert = {
        message: '',
        success: false,
        failure: false
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private groupService: GroupService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.groupID = this.route.snapshot.params['id'];
        this.cardID = this.route.snapshot.params['cardID'];

        if (this.cardID === '') {
            this.title = 'Creating a New Card';
        } else {
            this.title = 'Managing the Card';

            this.groupService.getCardByID(this.cardID)
                .subscribe(
                    data => {
                        this.cardTitle = data.card.Title;
                        this.cardDescription = data.card.Description;
                        this.title += ' (' + data.card.Title + ')';
                    },
                    err => {
                        console.log(err);
                    }
                );
        }

        this.groupService.getGroupById(this.groupID)
            .subscribe(
                data => {
                    this.group = data.group;
                },
                err => {
                    console.log(err);
                }
            );
    }

    saveCard() {
        if (this.validateForm()) {
            if (this.cardID !== '') {
                this.groupService.updateCard({
                    CardId: this.cardID,
                    CardTitle: this.cardTitle,
                    CardDescription: this.cardDescription,
                    GroupId: this.groupID,
                    UserId: this.user.ID
                })
                    .subscribe(
                        data => {
                            if (data.success) {
                                this.alert.message = 'Your card has been updated! Redirecting you to the group cards in few seconds...';

                                setTimeout((router: Router) => {
                                    this.router.navigate(['/', 'group', this.groupID, 'cards']);
                                }, 3000);

                                this.alert.success = true;
                                this.alert.failure = false;
                            } else {
                                this.alert.message = 'Your card was not updated...';

                                this.alert.success = false;
                                this.alert.failure = true;
                            }
                        },
                        err => {
                            console.log(err);
                        }
                    );
            } else {
                this.groupService.createCard({
                    CardTitle: this.cardTitle,
                    CardDescription: this.cardDescription,
                    GroupId: this.groupID,
                    UserId: this.user.ID
                })
                    .subscribe(
                        data => {
                            if (data.success) {
                                this.alert.message = 'Your card has been created! Redirecting you to the group cards in few seconds...';

                                setTimeout((router: Router) => {
                                    this.router.navigate(['/', 'group', this.groupID, 'cards']);
                                }, 3000);

                                this.alert.success = true;
                                this.alert.failure = false;
                            } else {
                                this.alert.message = 'Your card was not created...';

                                this.alert.success = false;
                                this.alert.failure = true;
                            }
                        },
                        err => {
                            console.log(err);
                        }
                    );
            }
        }
    }

    validateForm() {
        this.validation = [];

        if (this.cardTitle.length === 0) {
            this.validation.push('Card Title is a required field.');
        }

        if (this.cardDescription.length === 0) {
            this.validation.push('Card Description is a required field.');
        }

        return (this.validation.length == 0);
    }
}
