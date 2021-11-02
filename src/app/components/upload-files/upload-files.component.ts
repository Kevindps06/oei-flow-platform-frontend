import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FileItem } from 'src/app/interfaces/FileItem';
import { Utils } from 'src/app/classes/utils';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
})
export class UploadFilesComponent implements OnInit {
  @Input() requiredFeedback: string = '';

  constructor() {}

  ngOnInit(): void {}

  Files: FileItem[] = [];

  @Output() onFilesChange: EventEmitter<FileItem[]> = new EventEmitter();

  whenUploadFiles(event: any) {
    let currentFilesLength = this.Files.length;

    for (let i = 0; event.target.files.length > i; i++) {
      this.Files.push({
        Index: currentFilesLength + i,
        Name: event.target.files[i].name,
        Size: event.target.files[i].size,
        Type: event.target.files[i].type,
        Uploaded: false,
      });

      Utils.getBase64(event.target.files[i]).then((result) => {
        this.Files[currentFilesLength + i].Bytes = result as string;
        this.Files[currentFilesLength + i].Uploaded = true;
      });
    }

    event.target.value = null;

    this.onFilesChange.emit(this.Files);
  }

  whenRemoveFiles(index: number) {
    this.Files.splice(index, 1);

    for (let i = 0; this.Files.length > i; i++) {
      this.Files[i].Index = i;
    }

    this.onFilesChange.emit(this.Files);
  }

  validateFiles(fileItems: FileItem[]) {
    return Utils.validateFiles(fileItems);
  }
}
