import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ToastMessage } from './interfaces/toast-message';
import { WaitTask } from './interfaces/WaitTask';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'OEI';

  loggedUser: any;
  waitTasks: WaitTask[] = [];
  toastMessages: ToastMessage[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.onPushWaitTask.subscribe((waitTask: WaitTask) => {
      const taskIndex = this.waitTasks.findIndex(
        (element) => element.id === waitTask.id
      );

      if (taskIndex !== -1) {
        if (waitTask.progress === 100) {
          this.waitTasks.splice(
            this.waitTasks.findIndex((element) => element.id === waitTask.id)
          );

          return;
        }

        if (waitTask.description) {
          this.waitTasks[taskIndex].description = waitTask.description;
        }

        this.waitTasks[taskIndex].progress = waitTask.progress;
      } else {
        this.waitTasks.push(waitTask);
      }
    });

    this.sharedService.onPushToastMessage.subscribe(
      (toastMessage: ToastMessage) => {
        this.toastMessages.push(toastMessage);

        if (toastMessage.autohide !== -1) {
          setTimeout(
            () => {
              this.removeToastMessage(toastMessage.id);
            },
            toastMessage.autohide ? toastMessage.autohide : 6500
          );
        }
      }
    );
  }

  removeToastMessage(toastId: string) {
    let toastIndex;

    if (
      (toastIndex = this.toastMessages.findIndex(
        (element) => element.id === toastId
      )) !== -1
    ) {
      this.toastMessages[toastIndex].hide = true;

      setTimeout(() => {
        this.toastMessages.splice(
          this.toastMessages.findIndex((element) => element.id === toastId),
          1
        );
      }, 400);
    }
  }

  loadingScreen: boolean = false;

  loadingScreenAnimationStart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.loadingScreen = true;
    }
  }

  loadingScreenAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.loadingScreen = false;
    }
  }

  toastShow: boolean = false;

  toastShowAnimationStart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.toastShow = true;
    }
  }

  toastShowAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.toastShow = false;
    }
  }

  inMaintenance: boolean = false;

  maintenanceScreenAnimationStart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.inMaintenance = true;
    }
  }

  maintenanceScreenAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.inMaintenance = false;
    }
  }

  inCoding: boolean = false;

  codingScreenAnimationStart(event: AnimationEvent) {
    if (event.animationName === 'fadeIn') {
      this.inCoding = true;
    }
  }

  codingScreenAnimationEnd(event: AnimationEvent) {
    if (event.animationName === 'fadeOut') {
      this.inCoding = false;
    }
  }
}
