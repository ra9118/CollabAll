import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class MessageService {
    constructor(
        private apiService: ApiService
    ) { }

    getMessagesByGroup(id) {
      return this.apiService.get('/services/message/get-messages-by-group?groupID=' + id)
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
