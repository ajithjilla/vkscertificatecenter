import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';

import { AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs/internal/Observable';

export interface Certificate {
  aadhaarNumber: any,
  certificateUrl: any,
  eventId: number,
}

@Component({
  selector: 'app-download-certificate',
  templateUrl: './download-certificate.component.html',
  styleUrls: ['./download-certificate.component.scss']
})

export class DownloadCertificateComponent implements OnInit {

  //firebase variables
  itemsCollection!: AngularFirestoreCollection<Certificate>;
  ref!: AngularFireStorageReference;
  task!: any;
  uploadProgress!: any;
  downloadURL!: Observable<string>;
  uploadState!: Observable<string>;
  items: any;

  //UI items
  aadharNumber!: any;
  eventId: number = 0;
  event: any;
  generatedCaptcha: any;
  certificateData: any;

  //image items
  image: any;
  imageSrc: any;
  url: any;
  alert: any;
  success = false;
  loading = false;
  captcha: any;
  popup: boolean = false;

  constructor(private firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection<Certificate>('certificate');
    firestore.collection('eventDetail').valueChanges().subscribe(data => {
      this.items = data;
    });
  }

  ngOnInit(): void {
    this.generateCAPTCHA();
  }

  getCertificate() {
    // this.popup= true;
    if (!this.aadharNumber) {
      this.alert = "*Please enter aadhar number";
      this.clearError();
      return;
    }

    if (this.aadharNumber.toString().length != 12) {
      this.alert = "*Please enter valid aadhar number";
      this.clearError();
      return;
    }

    // if (this.eventId != 0) {
    //   this.alert = "*Please select event of certificate";
    //   this.clearError();
    //   return;
    // }

    if (this.generatedCaptcha != this.captcha) {
      this.alert = "Invalid Captcha....";
      this.clearError();
      return;
    }

    this.loading = true;
    // this.generatedCaptcha
    this.firestore.collection('certificate', ref => ref.where('aadhaarNumber', '==', this.aadharNumber).where('eventId', '==', this.eventId).limit(1)).valueChanges().subscribe((data: any) => {
      this.loading = false;
      this.certificateData = data[0];

      if(this.certificateData) {
        this.success = true;
        this.captcha = '';
        this.popup = true;
        this.generateCAPTCHA();
        return;
      }

      if(!this.certificateData) {
        this.success = false;
        this.alert = "No certificate found for this event on this aadhar";
      this.clearError();
      }
    });
  }

  generateCAPTCHA() {
    this.generatedCaptcha = Math.random().toString(36).substring(7);
  }

  clear() {
    this.aadharNumber = null;
    this.eventId = 0;
    this.certificateData = null;
    this.popup = false;
    this.success = false;
    this.captcha = '';
    this.generateCAPTCHA();
  };

  clearError() {
    setTimeout(() => {
      this.alert = "";
      this.success = false;
    }, 2000);
  }

  view() {
    this.popup = true;
  }
  popupClose() {
    this.popup = false;
  }
}
