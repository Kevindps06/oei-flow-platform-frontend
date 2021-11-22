import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/interfaces/FileItem';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-forms-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit {
  Files: FileItem[] = [];

  setFiles(Files: FileItem[]) {
    this.Files = Files;
  }

  constructor(private formsService: FormsService) {}

  ngOnInit(): void {}

  async btnSubmitClick() {
    let filesUploadsPromises = [];

    for (let i = 0; this.Files.length > i; i++)
      filesUploadsPromises.push(
        this.formsService
          .postUploadFile(
            this.Files[i].Name,
            this.Files[i].Bytes as ArrayBuffer
          )
          .subscribe((httpEvent) => {
            switch (httpEvent.type) {
              case HttpEventType.Response:
                console.log(httpEvent.body);
                break;
            }
          })
      );

    await Promise.all(filesUploadsPromises);
  }
}
