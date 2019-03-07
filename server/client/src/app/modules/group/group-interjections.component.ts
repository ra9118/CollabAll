import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupService, UserService } from '../../shared';

@Component({
    selector: 'group-interjections',
    templateUrl: './group-interjections.component.html',
    styleUrls: ['./group-interjections.component.css']
})
export class GroupInterjectionsComponent {
    user = this.userService.getAuthenticatedUser();
    group = {};
    groupID = 0;
    interjections = [];
    interjectionSplices = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private groupService: GroupService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.groupID = this.route.snapshot.params['id'];

        this.groupService.getGroupById(this.groupID)
            .subscribe(
                data => {
                    this.group = data.group;
                },
                err => {
                    console.log(err);
                }
            );

        this.getInterjections();
    }

    getInterjections() {
        this.interjectionSplices = [];

        this.groupService.getInterjectionsForGroup(this.groupID)
            .subscribe(
                data => {
                    this.interjections = data.interjections;

                    for (let i = 0; i < this.interjections.length; i++) {
                        this.interjections[i].Icon = this.interjections[i].Icon.substring(6);
                    }

                    for (let i = 0; i < this.interjections.length; i += 4) {
                        this.interjectionSplices.push(this.interjections.slice(i, i + 4));
                    }
                },
                err => {
                    console.log(err);
                }
            )
    }

    deleteInterjection(id) {
        if (window.confirm("Interjection deletion cannot be reverted. Proceed with deleting this interjection?")) {
            this.groupService.deleteInterjection(id)
                .subscribe(
                    data => {
                        console.log(data);

                        this.getInterjections();
                    },
                    err => {
                        console.log(err);
                    }
                )
        }
    }
}
