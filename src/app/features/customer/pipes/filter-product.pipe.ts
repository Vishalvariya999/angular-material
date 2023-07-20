import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {

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
