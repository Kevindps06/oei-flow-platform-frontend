import { Directive, HostListener, Input } from '@angular/core';
import { Utils } from '../classes/utils';

@Directive({
  selector: '[MinOnlyPriceNumbers]',
})
export class MinOnlyPriceNumbersDirective {
  @Input() MinOnlyPriceNumbers!: number;

  regEx = new RegExp('[0-9]');

  constructor() {}

  @HostListener('input', ['$event']) onInput(event: any) {
    if (event.data) {
      let finalValue: string = '';

      for (const character of event.target.value) {
        if (
          this.regEx.test(character) &&
          this.MinOnlyPriceNumbers <= parseInt(finalValue.concat(character))
        ) {
          finalValue = finalValue.concat(character);
        }
      }

      event.target.value = finalValue
        ? Utils.numberWithPriceSpaces(parseInt(finalValue))
        : '';
    }
  }
}
