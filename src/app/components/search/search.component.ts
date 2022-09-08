import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // inject the router
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string){
    console.log(`value=${value}`)
    // Route the data to our "search" route
    // It will be handle by the ProductListComponent
    this.router.navigateByUrl(`/search/${value}`) // {path: 'serch/:keyword', ...}
  }

}
