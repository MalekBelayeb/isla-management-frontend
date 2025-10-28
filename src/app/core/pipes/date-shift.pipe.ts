import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateShift',
})
export class DateShiftPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return `${(value as any).hour ?? '--'}:${(value as any).minute ?? '--'}`;
  }
}
