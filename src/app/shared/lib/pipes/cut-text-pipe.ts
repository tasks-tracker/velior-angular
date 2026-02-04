import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText',
  standalone: true,
})
export class CutTextPipe implements PipeTransform {
  transform(value: string, maxLength: number): string {
    if (!value) {
      return '';
    }

    if (value.length > maxLength) {
      return value.substring(0, maxLength) + '...';
    }

    return value;
  }
}
