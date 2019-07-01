import { Pipe, PipeTransform } from '@angular/core';
import { JunnuInfo } from './junnu-info';

@Pipe({
  name: 'searchNamesPipe'
})
export class SearchNamesPipePipe implements PipeTransform {

  transform(namesList: JunnuInfo[], searchName: string): any {
    return namesList!=null?namesList.filter(junnu => junnu.name.startsWith(searchName)):namesList;
  }

}
