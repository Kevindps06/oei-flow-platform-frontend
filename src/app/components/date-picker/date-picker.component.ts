import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit {
  @Input() allowPass: boolean = true;
  @Input() requiredFeedbackDay: string = '';
  @Input() requiredFeedbackMonth: string = '';
  @Input() requiredFeedbackYear: string = '';

  anos: number[] = [];

  meses: { month: string; disabled: boolean }[] = [
    { month: 'Enero', disabled: false },
    { month: 'Febrero', disabled: false },
    { month: 'Marzo', disabled: false },
    { month: 'Abril', disabled: false },
    { month: 'Mayo', disabled: false },
    { month: 'Junio', disabled: false },
    { month: 'Julio', disabled: false },
    { month: 'Agosto', disabled: false },
    { month: 'Septiembre', disabled: false },
    { month: 'Octubre', disabled: false },
    { month: 'Noviembre', disabled: false },
    { month: 'Diciembre', disabled: false },
  ];
  monthsString: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  diasDelMes: { day: number; disabled: boolean }[] = [];

  ano!: number;

  onAnoChange() {
    this.mes = '';
    this.dia = undefined;

    this.meses = [
      { month: 'Enero', disabled: this.monthIsInPass('Enero') },
      { month: 'Febrero', disabled: this.monthIsInPass('Febrero') },
      { month: 'Marzo', disabled: this.monthIsInPass('Marzo') },
      { month: 'Abril', disabled: this.monthIsInPass('Abril') },
      { month: 'Mayo', disabled: this.monthIsInPass('Mayo') },
      { month: 'Junio', disabled: this.monthIsInPass('Junio') },
      { month: 'Julio', disabled: this.monthIsInPass('Julio') },
      { month: 'Agosto', disabled: this.monthIsInPass('Agosto') },
      { month: 'Septiembre', disabled: this.monthIsInPass('Septiembre') },
      { month: 'Octubre', disabled: this.monthIsInPass('Octubre') },
      { month: 'Noviembre', disabled: this.monthIsInPass('Noviembre') },
      { month: 'Diciembre', disabled: this.monthIsInPass('Diciembre') },
    ];
  }

  mes: string = '';

  onMesChange() {
    var daysInMonth = new Date(
      this.ano,
      this.monthsString.indexOf(this.mes) + 1,
      0
    ).getDate();

    this.dia = undefined;
    this.diasDelMes = [];
    for (let i = 1; daysInMonth >= i; i++) {
      this.diasDelMes.push({
        day: i,
        disabled: this.dayIsInPass(i),
      });
    }
  }

  dia: number | undefined;

  onDiaChange() {
    this.onDateChange.emit(
      new Date(this.ano, this.monthsString.indexOf(this.mes), this.dia)
    );
  }

  @Output() onDateChange: EventEmitter<Date> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    var date = new Date();

    for (let i = date.getFullYear(); date.getFullYear() + 1 >= i; i++) {
      this.anos.push(i);
    }
  }

  yearIsInPass(year: number) {
    if (!this.allowPass) {
      let date = new Date();

      if (year >= date.getFullYear()) {
        return false;
      }

      return true;
    }

    return false;
  }

  monthIsInPass(month: string) {
    if (!this.allowPass) {
      let date = new Date();

      if (this.ano > date.getFullYear()) {
        return false;
      }

      if (this.ano == date.getFullYear()) {
        if (this.monthsString.indexOf(month) >= date.getMonth()) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  dayIsInPass(day: number) {
    if (!this.allowPass) {
      let date = new Date();

      if (this.ano > date.getFullYear()) {
        return false;
      }

      if (this.monthsString.indexOf(this.mes) > date.getMonth()) {
        return false;
      }

      if (
        this.ano == date.getFullYear() &&
        this.monthsString.indexOf(this.mes) == date.getMonth()
      ) {
        if (day >= date.getDay()) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}
