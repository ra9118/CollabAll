import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';

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
                  var newMessages = data.messages.map(function(message) {
                    message.timestamp = moment(message.timestamp).format("MM-DD-YY HH:mm:ss")
                    return message;
                  });
                  data.messages = newMessages;
                  return data;
              },
              err => {
                  return err;
              }
          ));
  }
}
