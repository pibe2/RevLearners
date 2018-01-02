import { Component } from '@angular/core';
import { FileDropModule, UploadFile, UploadEvent } from 'ngx-file-drop';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {

  public selectedFiles;
  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    for (var file of event.files) {
      this.files.push(file);
    }
    for (var file of this.files) {
      file.fileEntry.file(info => {
        console.log(info);
      });
    }
  }

  public removeFile(file: UploadFile) {
    const idx: number = this.files.indexOf(file);
    this.files.splice(idx, 1);
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
