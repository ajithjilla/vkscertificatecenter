import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

export interface Certificate {
  aadhaarNumber: any,
  certificateUrl: any,
  eventId: number,
}

@Component({
  selector: 'app-upload-certificate',
  templateUrl: './upload-certificate.component.html',
  styleUrls: ['./upload-certificate.component.scss']
})
export class UploadCertificateComponent implements OnInit {

  //firebase variables
  itemsCollection!: AngularFirestoreCollection<Certificate>;
  ref!: AngularFireStorageReference;
  task!: any;
  uploadProgress!: any;
  downloadURL!: Observable<string>;
  uploadState!: Observable<string>;

  //UI items
  aadharNumber!: any;
  eventId: number = 1;
  event: any;

  //image items
  image: any;
  imageSrc: any;
  url: any;
  alert: any;
  success = false;
  loading= false;

  constructor(
    firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    this.itemsCollection = firestore.collection<Certificate>('certificate');
  }

  ngOnInit(): void { }

  async onSelectFile(event: any) {
    this.event = event;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }

  }

  async uploadImage() {
    
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

    if (!this.event) {
      this.alert = "*Please select certificate to upload";
      this.clearError();
      return;
    }

    this.loading = true;
    if (this.event.target.files && this.event.target.files[0]) {
      const file = this.event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }

    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(this.event.target.files[0]).then((result) => {
      let data = result;
    });

    await this.task;
     this.ref.getDownloadURL().subscribe((data) => {
      this.image = data;
      this.addDataToDB();
    });
  }

  addDataToDB() {

    let data = {
      aadhaarNumber: this.aadharNumber,
      certificateUrl: this.image,
      eventId: this.eventId
    }
    this.itemsCollection.add(data).then((result) => {

      if(result) {
        this.loading = false;
        this.aadharNumber = null;
        this.eventId = 1;
        this.image = null;
        this.url = null;
        this.alert = "Certificate Uploaded successfully";
        this.success = true;
        this.clearError();
      }

    },(err) => {
      console.log("Fail to add data", err);
      this.alert = "*Unable to upload certificate. Please try again later.";
    });
  }

  clearError() {
    setTimeout(() => {
      this.alert = "";
      this.success =  false;
    }, 2000);
  }

}
