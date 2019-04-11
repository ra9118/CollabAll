import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class UserService {
    LOCAL_TOKEN_KEY = 'yourTokenKey';
    AUTH_USER_KEY = 'authUser';
    AVATAR_USER_KEY = 'avatarUser';

    authToken;
    authUser;

    constructor(
        private apiService: ApiService,
        private http: HttpClient,
        private jwtService: JwtService
    ) { }

    isAuthenticated(): boolean {
        return (window.localStorage.getItem(this.AUTH_USER_KEY) !== null);
    }

    loadUserCredentials(): void {
        let token = window.localStorage.getItem(this.LOCAL_TOKEN_KEY);
        let user = JSON.parse(window.localStorage.getItem(this.AUTH_USER_KEY));
        let avatar = window.localStorage.getItem(this.AVATAR_USER_KEY);

        if (token && user) {
            this.useCredentials(token, user, avatar);
        }
    }

    storeUserCredentials(token, user, avatar): void {
        window.localStorage.setItem(this.LOCAL_TOKEN_KEY, token);
        window.localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(user));
        window.localStorage.setItem(this.AVATAR_USER_KEY, avatar);

        this.useCredentials(token, user, avatar);
    }

    useCredentials(token, user, avatar): void {
        this.authToken = token;
        this.authUser = user;
        this.authUser.Avatar = avatar;
    }

    destroyUserCredentials(): void {
        this.authToken = undefined;
        this.authUser = undefined;

        window.localStorage.removeItem(this.LOCAL_TOKEN_KEY);
        window.localStorage.removeItem(this.AUTH_USER_KEY);
        window.localStorage.removeItem(this.AVATAR_USER_KEY);
    }

    getAuthenticatedUser() {
        return this.authUser;
    }

    getRoles() {
        return this.apiService.get('/services/role/get-all-roles')
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    login(user) {
        return this.apiService.post('/services/user/authenticate', user)
            .pipe(map(
                data => {
                    if (data.success) {
                        let avatar = '';

                        if (data.avatar != null) {
                            avatar = data.avatar.Avatar;
                        }

                        this.storeUserCredentials(data.token, data.user, avatar);
                    }

                    return data.success;
                },
                err => {
                    return err;
                }
            ));
    }

    logout() {
        this.destroyUserCredentials();
    }

    register(user) {
        return this.apiService.post('/services/user/create', user)
            .pipe(map(
                data => {
                    return data.success;
                },
                err => {
                    return err;
                }
            ));
    }

    updateProfile(user) {
        return this.apiService.post('/services/user/update', user)
            .pipe(map(
                data => {
                    if (data.success) {
                        this.storeUserCredentials(this.authToken, data.user, user.avatar);
                    }

                    return data.success;
                },
                err => {
                    return err;
                }
            ));
    }

    updatePassword(user) {
        return this.apiService.post('/services/user/update-password', user)
            .pipe(map(
                data => {
                    if (data.success) {
                        this.destroyUserCredentials();
                    }

                    return data.success;
                },
                err => {
                    return err;
                }
            ));
    }
}