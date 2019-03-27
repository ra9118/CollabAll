import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  validation = [];
  user = {
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private UserService: UserService
  ) { }

  register() {
    if (this.validateForm()) {
      this.UserService.register(this.user)
        .subscribe(
          data => {
            if (data) {
              this.UserService.login(this.user)
                .subscribe(
                  data => {
                    if (data) {
                      this.router.navigate(['']);
                    }
                  },
                  err => {
                    console.log('Login failed!');
                    console.log(err);
                  }
                );
            } else {
              this.validation = [];
              this.validation.push('The email address has already been registered.');
            }
          },
          err => {
            console.log('Register failed!');
            console.log(err);
          }
        );
    }
  }

  validateForm() {
    this.validation = [];

    if (!this.user.firstName) {
      this.validation.push('First name is a required field.');
    }

    if (!this.user.email) {
      this.validation.push('Email is a required field.');
    }

    if (!this.user.password) {
      this.validation.push('Password is a required field.');
    }

    if (this.user.password != this.user.password2) {
      this.validation.push('Password fields must match.');
    }

    return (this.validation.length == 0);
  }
}
