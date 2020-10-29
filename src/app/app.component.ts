import { Component } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { timer } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'front-music-genre-recognition';
    Musicgenre;
    //Timer
    timeLeft: number = 12;
    interval;
    subscribeTimer: any;
   //Lets initiate Record OBJ
    record;
    //Will use this flag for detect recording
    recording = false;
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
            console.log(data);
            this.Musicgenre = data;
          },
        error => console.log(error)
        );
        //this.sanitize(this.url);
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
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.pauseTimer();
        }
      }, 1000)
    }
    pauseTimer() {
      clearInterval(this.interval);
      this.timeLeft = 12;
    }
  
  recordStart() {
    this.initiateRecording();
    this.url = null;
    this.startTimer();
    const numbers = timer(13000);
    numbers.subscribe(
      x => this.stopRecording()
    );
  }
}