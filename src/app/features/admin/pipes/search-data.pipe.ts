import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchData'
})
export class SearchDataPipe implements PipeTransform {

  transform(value: any, searchTerms: any): any {
    if (!searchTerms) {
      return value
    }
    else {
      return value.filter((data: any) => {
        return Object.keys(data).some((key) => {
          return String(data[key]).toLocaleLowerCase().includes(searchTerms.toLocaleLowerCase());
        })
      })
    }
  }
}
