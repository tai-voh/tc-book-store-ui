import { Component } from '@angular/core';

@Component({
  selector: 'list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent {
  public static categoryList : Array<any> = [
    {id: '1', label: 'Drama'},
    {id: '2', label: 'Comedy'},
    {id: '3', label: 'Sport'}
  ];
  constructor() { }

  ngOnInit() { }

  static getCategoryList() {
    return this.categoryList;
  }

  static getCategoryName(id: string) {
    let name = 'Uncategorize';
    this.categoryList.every(c => {
      if (c.id === id) {
        name = c.label;
        return false;
      }
      return true;
    });
    return name;
  }
}
