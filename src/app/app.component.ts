import {Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JunnuInfo} from './junnu-info';
import { MatSnackBar, MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  appName = 'Junnu';
  namesList;
  junnuInfo;
  httpOptions = { headers: new HttpHeaders({
    
  })};
  isDataLoaded=false;
  junnuError;
  pageSize = 10;
  pageLength = 100;
  pageEvent: PageEvent;
  datasource: JunnuInfo[];
  searchInput = '';
  filteredData: JunnuInfo[];

  constructor(private httpClient:HttpClient, private snackbar: MatSnackBar) {
    this.junnuInfo = new JunnuInfo('','','Navin');
    this.getNames();
    //this.getNamesLocal();
  }

  ngOnInit(){
    
  }

  addName(){
    
    this.httpClient.put<JunnuInfo>('https://navs-api.herokuapp.com/junnu/add-name', this.junnuInfo, this.httpOptions).subscribe(
      data => {
        //this.getNames();
        this.datasource.push(data);
        this.snackbar.open(data.name + " successfully added!", "Great!",{
          duration: 5000
        });
      },
      error => {
        this.junnuError=error;
        this.snackbar.open("Error occured while adding name!", "Ooops!",{
          duration: 5000
        });
      }
    );
  }

  getNames(){
    this.httpClient.get<JunnuInfo[]>('https://navs-api.herokuapp.com/junnu/get-names').subscribe(data =>{
      this.datasource = data;
      this.isDataLoaded = true;
      if(this.searchInput.trim()!=''){
        this.filteredData = data.filter(info => info.name.startsWith(this.searchInput));
        this.namesList = this.filteredData.slice(0, this.pageSize);
        this.pageLength = this.filteredData.length;
      } else{
        this.namesList = this.datasource.slice(0, this.pageSize);
        this.pageLength = this.datasource.length;
      }
    });
    
  }

  onPageChange(event){
    let firstCut = event.pageIndex * event.pageSize;
    let secondCut = firstCut + event.pageSize;
    this.namesList = this.searchInput!=''? this.filteredData.slice(firstCut,secondCut):this.datasource.slice(firstCut, secondCut);
  }

  onSearchInput(){
    if(this.searchInput.trim()!=''){
      this.filteredData = this.datasource.filter(info => info.name.startsWith(this.searchInput));
      this.namesList = this.filteredData.slice(0, this.pageSize);
      this.pageLength = this.filteredData.length;
    } else{
      this.namesList = this.datasource.slice(0, this.pageSize);
      this.pageLength = this.datasource.length;
    }
  }

  getNamesLocal(){
    this.httpClient.get('http://localhost:8080/junnu/get-names').subscribe(data =>{
      this.namesList=data;
    });
  }

}
