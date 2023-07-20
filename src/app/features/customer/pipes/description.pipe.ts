import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description'
})
export class DescriptionPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(value: string, strLengthSearch: number): string {
    if (value.length > strLengthSearch) {
      return value.slice(0, strLengthSearch) + '...';
    }
    return value;
  }
}