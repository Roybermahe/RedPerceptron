import {Component, OnInit} from '@angular/core';
import {ReadFileService} from "../../services/read-file.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  tableDataFile = [] as any[];
  constructor(
    private fileService: ReadFileService
  ) {}

  uploadFile(event: any) {
    this.fileService.up(event.target.files[0]);
  }

  ngOnInit(): void {
    this.fileService.contentFile.subscribe(resp => {
      this.tableDataFile = resp;
    });
  }
}
