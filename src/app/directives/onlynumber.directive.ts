import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyNumbers]',
})
export class OnlyNumbersDirective {
  @Input() OnlyNumbers!: boolean;

  regEx = new RegExp('[0-9]');

  constructor() {}

  @HostListener('input', ['$event']) onInput(event: any) {
    if (this.OnlyNumbers && event.data) {
      let finalValue: string = '';

      for (const character of event.target.value) {
        if (this.regEx.test(character)) {
          finalValue = finalValue.concat(character);
        }
      }

      event.target.value = finalValue;
    }
  }
}
