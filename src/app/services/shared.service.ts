import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from '../interfaces/toast-message';
import { WaitTask } from '../interfaces/WaitTask';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private pushWaitTaskSource = new Subject<WaitTask>();
  onPushWaitTask = this.pushWaitTaskSource.asObservable();
  pushWaitTask(waitTask: WaitTask) {
    this.pushWaitTaskSource.next(waitTask);
  }

  private removeWaitTaskSource = new Subject<WaitTask>();
  onRemoveWaitTask = this.removeWaitTaskSource.asObservable();
  removeWaitTask(waitTask: WaitTask) {
    this.removeWaitTaskSource.next(waitTask);
  }

  private pushToastMessageSource = new Subject<ToastMessage>();
  onPushToastMessage = this.pushToastMessageSource.asObservable();
  pushToastMessage(toastMessage: ToastMessage) {
    this.pushToastMessageSource.next(toastMessage);
  }
}
