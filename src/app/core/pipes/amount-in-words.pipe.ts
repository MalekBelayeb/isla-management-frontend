import { Pipe, PipeTransform } from '@angular/core';
// @ts-ignore
import writtenNumber from 'written-number';

// Writes an amount in dinars in French words, e.g. 1250.5 -> "MILLE DEUX CENT CINQUANTE DINARS ET CINQ CENTS MILLIMES"
@Pipe({
  name: 'amountInWords',
})
export class AmountInWordsPipe implements PipeTransform {
  transform(amount: number | string | null | undefined): string {
    const value = Number(amount ?? 0) || 0;

    const dinarsValue = Math.floor(value);
    const millimesValue = Math.round((value - dinarsValue) * 1000);

    const dinarsWrittenForm = writtenNumber(dinarsValue, {
      lang: 'fr',
    }).toUpperCase();
    const millimesWrittenForm = writtenNumber(millimesValue, {
      lang: 'fr',
    }).toUpperCase();

    if (millimesValue <= 0) {
      return `${dinarsWrittenForm} DINARS`;
    }

    return `${dinarsWrittenForm} DINARS ET ${millimesWrittenForm} MILLIMES`;
  }
}
