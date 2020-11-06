import { Component } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { timer } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    title = 'front-music-genre-recognition';
    Musicgenre;
    //Timer
    timeLeft: number = 0;
    interval;
    subscribeTimer: any;
   //Lets initiate Record OBJ
    record;
    //Will use this flag for detect recording
    recording = false;
    enregistrement = false;
    //Url of Blob
    url;
    BlobUrl;
    private error;
    constructor(private domSanitizer: DomSanitizer, private http: HttpClient) {}
    sanitize(url: string){
      //this.BlobUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
      return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
    /**
     * Start recording.
     */
    initiateRecording() {

        this.recording = true;
        let mediaConstraints = {
            video: false,
            audio: true
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }
    /**
     * Will be called automatically.
     */
    successCallback(stream) {
        var options = {
            mimeType: "audio/wav",
            numberOfAudioChannels: 1,
            codecs: 1
        };
        //Start Actuall Recording
        var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
        this.record = new StereoAudioRecorder(stream, options);
        this.record.record();
    }
    /**
     * Stop recording.
     */
    stopRecording() {
        this.recording = false;
        this.record.stop(this.processRecording.bind(this));
    }
    /**
     * processRecording Do what ever you want with blob
     * @param  {any} blob Blog
     */
    processRecording(blob) {
        this.url = URL.createObjectURL(blob);
        console.log("blob", blob);
        console.log("url", this.url);
        const file = new File([blob], 'audio_tests.wav', {
        type: 'audio/wav'
        });
        const formData = new FormData();
        formData.append('document', file); // upload "File" object rather than a "Blob"
        this.http.post('http://127.0.0.1:8000/result/', formData).subscribe(
          data => {
            console.log(`${JSON.stringify(data)}`)
            this.Musicgenre = data
          },
        error => console.log(error)
        );
        //this.startTimer();
    }
    /**
     * Process Error.
     */
    errorCallback(error) {
        this.error = 'Can not play audio in your browser';
    }
    oberserableTimer() {
      const source = timer(1000, 2000);
      const abc = source.subscribe(val => {
        console.log(val, '-');
        this.subscribeTimer = this.timeLeft - val;
      });
    }

  startTimer() {
      this.enregistrement = true;
      this.interval = setInterval(() => {
        if (((this.timeLeft % 12) === 0) && (this.timeLeft !== 0)) {
          this.recordStart();
          this.timeLeft++;
        } else {
          this.timeLeft++;
        }
      }, 1000)
    }
  pauseTimer() {
      clearInterval(this.interval);
      //this.timeLeft = 12;
    }
  
  recordStart() {
    this.initiateRecording();
    this.url = null;
    //this.Musicgenre = null;
    //this.startTimer();
    //const numbers = timer(13000);
    this.stopRecording();
    
  }
  pausebutton() {
    this.enregistrement = false;
    this.recording = false;
    this.pauseTimer();
    this.url = null;
    this.Musicgenre = null;
  }
}