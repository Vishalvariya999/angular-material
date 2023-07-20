import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDescriptions'
})
export class FilterDescriptionsPipe implements PipeTransform {

  transform(value: string, strLengthSearch: number): string {
    if (value.length > strLengthSearch) {
      return value.slice(0, strLengthSearch) + '...';
    }
    return value;
  }

}
