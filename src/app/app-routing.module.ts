import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { DownloadCertificateComponent } from './download-certificate/download-certificate.component';
import { NgModule } from '@angular/core';
import { UploadCertificateComponent } from './upload-certificate/upload-certificate.component';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: "", component: UploadCertificateComponent },
  { path: "download-certificate", component: DownloadCertificateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
