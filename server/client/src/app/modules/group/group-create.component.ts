import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupService, UserService } from '../../shared';

@Component({
    selector: 'group-create',
    templateUrl: './group-create.component.html',
    styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent {
    group = {
        name: '',
        users: []
    };
    allUsers = [];
    selectedAllUsers = [];
    selectedGroupUsers = [];
    validation = [];

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
        this.groupService.getAllActiveUsers()
            .subscribe(
                data => {
                    this.allUsers = data.users;

                    let user = data.users.find((d) => {
                        return d.ID === this.userService.getAuthenticatedUser().ID;
                    });
                    this.group.users.push(user);

                    for (let i = 0; i < this.group.users.length; i++) {
                        for (let j = 0; j < this.allUsers.length; j++) {
                            if (this.group.users[i].ID == this.allUsers[j].ID) {
                                this.allUsers.splice(j, 1);
                                break;
                            }
                        }
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    createGroup() {
        if (this.validateForm()) {
            this.groupService.createGroup({
                GroupName: this.group.name,
                UserIds: this.group.users
            })
                .subscribe(
                    data => {
                        if (data.success && data.group.ID > 0) {
                            this.groupService.setDefaultInterjectionsForGroup({
                                GroupId: data.group.ID
                            })
                                .subscribe(
                                    data => {
                                        console.log(data);
                                    },
                                    err => {
                                        console.log(err);
                                    }
                                );

                            this.alert.message = 'Your group has been created! Redirecting you to the home page in few seconds...';

                            setTimeout((router: Router) => {
                                this.router.navigate(['']);
                            }, 3000);

                            this.alert.success = true;
                            this.alert.failure = false;
                        } else {
                            this.alert.message = 'Your group was not created...';

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

    addToGroup() {
        for (let i = 0; i < this.selectedAllUsers.length; i++) {
            for (let j = 0; j < this.allUsers.length; j++) {
                if (this.selectedAllUsers[i].ID == this.allUsers[j].ID) {
                    this.group.users.push(this.allUsers[j]);
                    this.group.users.sort(this.compare);
                    this.allUsers.splice(j, 1);
                    break;
                }
            }
        }
    }

    removeFromGroup() {
        for (let i = 0; i < this.selectedGroupUsers.length; i++) {
            for (let j = 0; j < this.group.users.length; j++) {
                if (this.selectedGroupUsers[i].ID == this.group.users[j].ID) {
                    this.allUsers.push(this.group.users[j]);
                    this.allUsers.sort(this.compare);
                    this.group.users.splice(j, 1);
                    break;
                }
            }
        }
    }

    compare(a, b) {
        if (a.FirstName < b.FirstName) {
            return -1;
        }

        if (a.FirstName > b.FirstName) {
            return 1;
        }

        return 0;
    }

    validateForm() {
        this.validation = [];

        if (!this.group.name) {
            this.validation.push('Group Name is a required field.');
        }

        if (this.group.users.length == 0) {
            this.validation.push('There needs to be a minimum of one user assigned to the group');
        }

        return (this.validation.length == 0);
    }
}
