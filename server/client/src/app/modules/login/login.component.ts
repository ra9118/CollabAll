import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authenticationStatus = '';
  user = {
    email: '',
    password: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private UserService: UserService
  ) { }

  login() {
    this.authenticationStatus = 'Login in-progress...';

    this.UserService.login(this.user)
      .subscribe(
        data => {
          if (data) {
            this.authenticationStatus = 'Login success!';

            this.router.navigate(['']);
          } else {
            this.authenticationStatus = 'Authentication failed. Email/Password is incorrect.';
          }
        },
        err => {
          console.log('Login failed!');
          console.log(err);
        }
      );
  }
}
