import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as mapboxgl from 'mapbox-gl';
import { image } from 'ionicons/icons';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {



  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage(){

    let user = this.user();
    let path = `users/${user.uid}`




    const dataUrl = (await this.utilsSvc.takePicture('imagen')).dataUrl;


    const loading =await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image= await this.firebaseSvc.uploadImage(imagePath, dataUrl);


    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);
    
      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
      
    }).catch(error => {
      console.log(error);
    
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    
    }).finally(() => {
      loading.dismiss();
    });
    
  }

}
