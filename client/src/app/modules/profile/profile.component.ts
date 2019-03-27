import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    id: this.userService.getAuthenticatedUser().ID,
    email: this.userService.getAuthenticatedUser().Email,
    firstName: this.userService.getAuthenticatedUser().FirstName,
    lastName: this.userService.getAuthenticatedUser().LastName,
    pic: this.userService.getAuthenticatedUser().Avatar,
    role: null
  };
  roles = [];
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

  ngOnInit() {
    this.userService.getRoles()
      .subscribe(
        data => {
          this.roles = data.roles;

          data.roles.forEach((role) => {
            if (role.ID == this.userService.getAuthenticatedUser().roleID) {
              this.user.role = role;
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  updateProfile() {
    if (this.validateForm()) {
      this.userService.updateProfile({
        ID: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        avatar: this.user.pic,
        roleId: this.user.role.ID
      })
        .subscribe(
          data => {
            if (data) {
              this.alert.message = 'Your profile has been updated! Redirecting you to the homepage in few seconds...';

              setTimeout((router: Router) => {
                this.router.navigate(['']);
              }, 3000);

              this.alert.success = true;
              this.alert.failure = false;
            } else {
              this.alert.message = 'Your profile was not updated...';

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

    if (!this.user.firstName) {
      this.validation.push('First Name is a required field.');
    }

    if (!this.user.lastName) {
      this.validation.push('Last Name is a required field.');
    }

    if (!this.user.email) {
      this.validation.push('Email is a required field.');
    }

    return (this.validation.length == 0);
  }

  encodeImageFileAsURL($event) {
    let image = $event.target.files[0];
    let fileSize = image.size;
    let imageSize = fileSize / 1048576;

    if (imageSize >= 1) {
      alert("Image needs to be less than 1 MB")
      return;
    }

    let reader = new FileReader();
    reader.onloadend = (e) => {
      this.user.pic = (<FileReader> e.target).result;
    };
    reader.readAsDataURL(image);
  }
}
