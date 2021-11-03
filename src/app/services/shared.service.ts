import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  userChangeEmitted = this.emitChangeSource.asObservable();
  // Service message commands
  emitUserChange(change: any) {
    this.emitChangeSource.next(change);
  }
}
