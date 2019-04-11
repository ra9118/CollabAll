import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserService } from './user.service';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivate(): boolean {
        if (!this.userService.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}