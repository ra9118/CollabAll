import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared';

@Component({
  selector: 'password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  user = {
    id: this.userService.getAuthenticatedUser().ID,
    password: '',
    password2: ''
  };
  validation = [];
  alert = {
    message: '',
    success: false,
    failure: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  resetPassword() {
    if (this.validateForm()) {
      this.userService.updatePassword({
        ID: this.user.id,
        password: this.user.password
      })
        .subscribe(
          data => {
            if (data) {
              this.alert.message = 'Your password has been updated! Redirecting you to the login page in few seconds...';

              setTimeout((router: Router) => {
                this.userService.logout();
                this.router.navigate(['/login']);
              }, 3000);

              this.alert.success = true;
              this.alert.failure = false;
            } else {
              this.alert.message = 'Your password was not updated...';

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

  validateForm() {
    this.validation = [];

    if (!this.user.password) {
      this.validation.push('Password is a required field!');
    }

    if (this.user.password2 != this.user.password) {
      this.validation.push('Password fields must match!');
    }

    return (this.validation.length == 0);
  }
}
