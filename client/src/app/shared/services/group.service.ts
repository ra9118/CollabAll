import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { UserService } from './user.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class GroupService {
    constructor(
        private apiService: ApiService,
        private http: HttpClient,
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    getUserGroups() {
        let params = new HttpParams();
        params.set('UserId', this.userService.getAuthenticatedUser().ID);

        return this.apiService.get('/services/group/get-my-groups?UserId=' + this.userService.getAuthenticatedUser().ID)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    getGroupById(id) {
        return this.apiService.get('/services/group/get-group-by-id?GroupId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    getAllActiveUsers() {
        return this.apiService.get('/services/user/get-all-active-users')
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    getGroupMembers(id) {
        return this.apiService.get('/services/group/get-group-members?GroupId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    createGroup(group) {
        return this.apiService.post('/services/group/create-group', group)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    updateGroup(group) {
        return this.apiService.post('/services/group/update-group', group)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    deleteGroup(id) {
        return this.apiService.post('/services/group/delete-group', id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    // Interjections

    getInterjectionByID(id) {
        return this.apiService.get('/services/interjection/get-interjection-by-id-for-group?GroupInterjectionId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    getInterjectionsForGroup(id) {
        return this.apiService.get('/services/interjection/get-interjections-for-group?GroupId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    setDefaultInterjectionsForGroup(id) {
        return this.apiService.post('/services/interjection/set-default-interjections-for-group', id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    createInterjection(interjection) {
        return this.apiService.post('/services/interjection/create-interjections-for-group', interjection)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    updateInterjection(interjection) {
        return this.apiService.post('/services/interjection/update-interjections-for-group', interjection)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    deleteInterjection(id) {
        return this.apiService.post('/services/interjection/delete-interjections-for-group', { GroupInterjectionId: id })
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    // Cards

    getCardByID(id) {
        return this.apiService.get('/services/card/get-card-by-id?CardId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    getCardsForGroup(id) {
        return this.apiService.get('/services/card/get-cards-for-group?GroupId=' + id)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    createCard(card) {
        return this.apiService.post('/services/card/create-card', card)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    updateCard(card) {
        return this.apiService.post('/services/card/update-card', card)
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }

    deleteCard(id) {
        return this.apiService.post('/services/card/delete-card', { CardId: id })
            .pipe(map(
                data => {
                    return data;
                },
                err => {
                    return err;
                }
            ));
    }
}