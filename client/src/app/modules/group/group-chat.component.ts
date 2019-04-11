import { Component, group } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as io from 'socket.io-client';
import * as moment from 'moment';

import { GroupService, UserService } from '../../shared';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'group-chat',
    templateUrl: './group-chat.component.html',
    styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent {
    url = environment.api_url;
    socket = null;

    user = this.userService.getAuthenticatedUser();

    group = {
        Name: ''
    };
    groupID = 0;
    groupUsers = [];
    groupCards = [];
    groupInterjections = [];
    recording = {
        available: false,
        recognitionService: null,
        started: false,
        chatPlaceholder: 'chat'
    }
    messages = [];
    currentCommunicator = 'None';
    currentCard = 'None';

    communicateInterjection = {
        Title: "Communicating!",
        Icon: "fa fa-volume-up",
        BackgroundColor: "#F1948A",
        TextColor: "#ffffff"
    };

    timeStampFormat = 'MM-DD-YY hh:mm:ss';

    chatMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private groupService: GroupService,
        private userService: UserService
    ) { }

    ngOnInit() {
        if((<any>window).webkitSpeechRecognition) {
            this.recording.available = true;
            this.recording.recognitionService = new (<any>window).webkitSpeechRecognition()
            this.recording.started = false;
        }
        else{
            this.recording.available = false
        }
        this.groupID = this.route.snapshot.params['id'];
        this.groupService.getGroupMembers(this.groupID)
            .subscribe(
                data => {
                    this.groupUsers = data.users;
                    this.groupUsers.sort(this.compare);

                    this.groupService.getGroupById(this.groupID)
                        .subscribe(
                            data => {
                                this.group = data.group;
                            },
                            err => {
                                console.log(err);
                            }
                        );

                    this.groupService.getCardsForGroup(this.groupID)
                        .subscribe(
                            data => {
                                this.groupCards = data.cards;
                            },
                            err => {
                                console.log(err);
                            }
                        );

                    this.groupService.getInterjectionsForGroup(this.groupID)
                        .subscribe(
                            data => {
                                this.groupInterjections = data.interjections;
                                this.groupInterjections.splice(0, 0, this.communicateInterjection);

                                for (let i = 0; i < this.groupInterjections.length; i++) {
                                    this.groupInterjections[i].Icon = this.groupInterjections[i].Icon.substring(6);
                                }
                            },
                            err => {
                                console.log(err);
                            }
                        );
                },
                err => {
                    console.log(err);
                }
            );

        this.socket = io.connect(this.url, { query: this.user.ID });

        this.socket.on('connect', (msg) => {
            this.socket.emit('join', this.user.ID);
        });

        this.socket.emit('subscribe', { group: this.groupID });

        this.socket.on('new_message', (message) => {
            if (message.groupID === this.groupID) {
                this.appendChat(message);
            }
        });
    }

    addToPlaceholder(text: string) {
        this.recording.chatPlaceholder = text
    }

    startStt(){
        if(this.recording.available && this.recording.started){
            this.recording.recognitionService.stop();
            this.recording.started = false;
            return
        }
        if(this.recording.available) {
            this.recording.recognitionService.continuous = true
            this.recording.recognitionService.interimResults = true
            this.recording.recognitionService.onaudiostart = (start) => {
                console.log('started recording')
            }

            this.recording.recognitionService.onspeechend = () => {
                if(this.recording.started){
                    this.recording.recognitionService.stop();
                    this.recording.started = false;
                }
                else{
                    this.recording.recognitionService.stop();
                }
            }

            this.recording.recognitionService.onerror = (error) => {
                console.log('Error, ', error)
            }

            this.recording.recognitionService.onresult = (event) => {
                if(event.results[event.results.length - 1].isFinal){
                    this.sendStt(event.results[event.results.length - 1][0].transcript)
                }
                else{
                    console.log(event.results[event.results.length - 1][0].transcript)
                }
            }
        }
        this.recording.recognitionService.start()
        this.recording.started = true
        console.log('stt starts here')
    }

    ngOnDestroy() {
        this.socket.emit('unsubscribe', { group: this.groupID });
    }

    emitChat(message) {
        this.socket.emit('chat', message);
    }

    appendChat(message) {
        let sound;

        if (message.body.Title === 'Communicating!') {
            sound = document.getElementById('button-09');
        } else {
            sound = document.getElementById(message.body.Sound);
        }
        this.messages.push(message);

        if (message.body.includes === undefined && message.body.Title === 'Communicating!') {
            this.currentCommunicator = message.user;
        }

        if (message.body.includes !== undefined && message.body.includes('Discussing:')) {
            this.currentCard = message.body.replace('Discussing:', '');
        }
        
        if (this.user.FirstName + ' ' + this.user.LastName !== message.user && message.body.Title !== undefined) {
            sound.play();
            console.log('sound played');
        }
    }

    issueInterjection(interjection) {
        let action = {
            body: interjection,
            user: this.user.FirstName + ' ' + this.user.LastName,
            userAvatar: this.user.Avatar,
            groupID: this.groupID,
            timestamp: moment(moment.now()).format(this.timeStampFormat)
        };

        this.appendChat(action);
        this.emitChat(action);
    }

    sendStt(message: string) {
        let action = {
            body: message,
            user: `${this.user.FirstName} ${this.user.LastName}`,
            userAvatar: this.user.Avatar,
            groupID: this.groupID,
            timestamp: moment(moment.now()).format(this.timeStampFormat)
        }
        this.appendChat(action)
        this.emitChat(action)
    }

    sendMessage() {
        if (this.chatMessage !== '') {
            let action = {
                body: this.chatMessage,
                user: this.user.FirstName + ' ' + this.user.LastName,
                userAvatar: this.user.Avatar,
                groupID: this.groupID,
                timestamp: moment(moment.now()).format(this.timeStampFormat)
            };

            this.appendChat(action);
            this.emitChat(action);
            this.chatMessage = '';
        }
    }

    communicate() {
        let action = {
            body: 'Communicating!',
            user: this.user.FirstName + ' ' + this.user.LastName,
            userAvatar: this.user.Avatar,
            groupID: this.groupID,
            timestamp: moment(moment.now()).format(this.timeStampFormat)
        };

        this.appendChat(action);
        this.emitChat(action);
    }

    discuss(cardID) {
        let result = this.groupCards.find((d) => {
            return d.ID === cardID;
        });

        let action = {
            body: 'Discussing: ' + result.Title,
            user: this.user.FirstName + ' ' + this.user.LastName,
            userAvatar: this.user.Avatar,
            groupID: this.groupID,
            timestamp: moment(moment.now()).format(this.timeStampFormat)
        };

        this.appendChat(action);
        this.emitChat(action);
    }

    interject(id) {
        let result = '';

        switch (id) {
            case '1':
                result = 'Slow Down!';
                break;
            case '2':
                result = 'Question!';
                break;
            case '3':
                result = 'Repeat!';
                break;
            case '4':
                result = 'Don\'t Understand!';
                break;
        }

        let action = {
            body: result,
            user: this.user.FirstName + ' ' + this.user.LastName,
            userAvatar: this.user.Avatar,
            groupID: this.groupID,
            timestamp: moment(moment.now()).format(this.timeStampFormat)
        };

        this.appendChat(action);
        this.emitChat(action);
    }

    compare(a, b) {
        if (a.FirstName < b.FirstName) {
            return -1;
        }

        if (a.FirstName > b.FirstName) {
            return 1;
        }

        return 0;
    }

    doesItStartWith(string, substring) {
        if (typeof string !== 'string') {
            return false;
        }

        return (string.indexOf(substring) > -1);
    }
}
