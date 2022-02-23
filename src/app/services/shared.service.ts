import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Utils } from '../classes/utils';
import { ToastMessage } from '../interfaces/toast-message';
import { WaitTask } from '../interfaces/WaitTask';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private pushWaitTaskSource = new Subject<WaitTask>();
  onPushWaitTask = this.pushWaitTaskSource.asObservable();
  pushWaitTask(waitTask: WaitTask) {
    if (!waitTask.id) {
      waitTask = Object.assign(waitTask, {
        id: Utils.makeRandomString(4),
      });
    }

    this.pushWaitTaskSource.next(waitTask);

    return waitTask.id;
  }

  private pushToastMessageSource = new Subject<ToastMessage>();
  onPushToastMessage = this.pushToastMessageSource.asObservable();
  pushToastMessage(toastMessage: ToastMessage) {
    this.pushToastMessageSource.next(toastMessage);
  }
}
