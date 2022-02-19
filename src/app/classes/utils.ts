import { HttpEventType } from '@angular/common/http';
import { FileItem } from '../interfaces/FileItem';
import { Tramo } from '../interfaces/tramo';
import { FormsService } from '../services/forms.service';
import { SharedService } from '../services/shared.service';

export class Utils {
  constructor(
    public formsService: FormsService,
    public sharedService: SharedService
  ) {}

  static makeRandomString(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  static getBase64(file: File) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = function (e) {
        resolve((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  }

  static getBuffer(file: File) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = function (e) {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static validateEmail(email: string): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static validateFiles(fileItems: FileItem[]): boolean {
    if (fileItems.length > 0) {
      for (let i = 0; fileItems.length > i; i++) {
        if (!fileItems[i].Uploaded) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  async uploadFilesToServer(files: FileItem[]) {
    let filesUploadsPromises = [];

    for (let i = 0; files.length > i; i++)
      filesUploadsPromises.push(
        this.formsService
          .postUploadFile(files[i].Name, files[i].Bytes as ArrayBuffer)
          .subscribe((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Response:
                return httpEvent.body;
            }
          })
      );

    return await Promise.all(filesUploadsPromises);
  }
  
  static numberWithPriceSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
}
