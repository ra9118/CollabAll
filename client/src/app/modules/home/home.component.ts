import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private UserService: UserService
    ) { }

    logout() {
        this.UserService.logout();
        this.router.navigate(['login']);
    }
}
