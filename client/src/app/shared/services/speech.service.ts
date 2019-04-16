import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs/Rx";
import * as _ from 'lodash'

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Injectable()
export class SpeechService {
    speechRecognition: any;
    available = true
    started = false
    chatPlaceholder = 'chat'

    constructor(private zone: NgZone) {

    }

    // Checks if the speech service is available
    checkAvailability() {
        if((<any>window).webkitSpeechRecognition) {
            this.available = true
        }
        else {
            this.available = false
        }
    }

    record(): Observable<string> {
        return Observable.create(observer => {
            // Config for the speech recognition
            // Future use: Can use the language to detect and recognise text from different languages
            const {webkitSpeechRecognition}: IWindow = <IWindow> window;
            this.speechRecognition = new webkitSpeechRecognition();
            this.speechRecognition.continuous  = true;
            this.speechRecognition.interimResults = true;

            this.speechRecognition.onresult = speech => {
                let term: string = ""
                if(speech.results) {
                    var result = speech.results[speech.resultIndex]
                    var transcript = result[0].transcript
                    if(result.isFinal){
                        if (result[0].confidence < 0.3) {
                            console.log("Unrecognized result - Please try again");
                        }
                        else {
                            term = _.trim(transcript);
                            console.log("Did you said? -> " + term + " , If not then say something else...");
                        }
                    }
                    else{
                        this.chatPlaceholder = speech.results[speech.resultIndex][0].transcript
                    }
                }
                this.zone.run(() => {
                    observer.next(term)
                })
            }

            
            this.speechRecognition.onerror = error => {
                observer.error(error);
            };

            this.speechRecognition.onend = () => {
                observer.complete();
                this.started = false;
            };

            this.speechRecognition.start();
            this.started = true;
            console.log("Say something - We are listening !!!");
        })
    }

    DestroySpeechObject() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
            this.started = false
        }
    }
}