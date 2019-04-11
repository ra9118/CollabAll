import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GroupService } from '../../shared/services/group.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    groupSplices = [];
    rows = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private groupService: GroupService
    ) { }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this.groupSplices = [];

        this.groupService.getUserGroups()
            .subscribe(
                data => {
                    if (data.success) {
                        let groups = data.groups;
                        groups.sort(this.compare);

                        this.rows = Math.ceil(groups.length / 4);

                        for (let i = 0; i < groups.length; i += 4) {
                            this.groupSplices.push(groups.slice(i, i + 4));
                        }
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    deleteGroup(id) {
        if (window.confirm("Group deletion cannot be reverted. Proceed with deleting this group?")) {
            this.groupService.deleteGroup({
                GroupId: id
            })
                .subscribe(
                    data => {
                        this.getGroups();
                    },
                    err => {
                        console.log(err);
                    }
                )
        }
    }

    compare(a, b) {
        if (a.group.Name < b.group.Name) {
            return -1;
        }

        if (a.group.Name > b.group.Name) {
            return 1;
        }

        return 0;
    }
}
