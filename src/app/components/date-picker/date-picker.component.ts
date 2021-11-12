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

  years: number[] = [];

  monthsOfYear: { month: string; number: number }[] = [
    { month: 'Enero', number: 1 },
    { month: 'Febrero', number: 2 },
    { month: 'Marzo', number: 3 },
    { month: 'Abril', number: 4 },
    { month: 'Mayo', number: 5 },
    { month: 'Junio', number: 6 },
    { month: 'Julio', number: 7 },
    { month: 'Agosto', number: 8 },
    { month: 'Septiembre', number: 9 },
    { month: 'Octubre', number: 10 },
    { month: 'Noviembre', number: 11 },
    { month: 'Diciembre', number: 12 },
  ];

  daysOfMonth: number[] = [];

  year: number | undefined;

  onYearChange() {
    this.month = undefined;
    this.day = undefined;
  }

  month: number | undefined;

  onMonthChange() {
    if (!this.year || !this.month) {
      return;
    }

    const daysInMonth = new Date(this.year, this.month, 0).getDate();

    this.day = undefined;
    this.daysOfMonth = [];
    for (let i = 1; daysInMonth >= i; i++) {
      this.daysOfMonth.push(i);
    }
  }

  day: number | undefined;

  onDayChange() {
    if (!this.year || !this.month) {
      return;
    }

    this.onDateChange.emit(new Date(this.year, this.month, this.day));
  }

  @Output() onDateChange: EventEmitter<Date> = new EventEmitter();

  constructor() {}

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  ngOnInit(): void {
    var date = new Date();

    for (let i = date.getFullYear(); date.getFullYear() + 1 >= i; i++) {
      this.years.push(i);
    }
  }

  yearIsInThePast(year: number) {
    if (!this.allowPass) {
      let date = new Date();

      if (year >= date.getFullYear()) {
        return false;
      }

      return true;
    }

    return false;
  }

  monthIsInThePast(month: number) {
    if (!this.year) {
      return true;
    }

    if (!this.allowPass) {
      let date = new Date();

      if (
        this.year > date.getFullYear() ||
        (this.year == date.getFullYear() && month - 1 >= date.getMonth())
      ) {
        return false;
      }

      return true;
    }

    return false;
  }

  dayIsInThePast(day: number) {
    if (!this.year || !this.month) {
      return true;
    }

    if (!this.allowPass) {
      let date = new Date();

      if (
        this.year > date.getFullYear() ||
        (this.year == date.getFullYear() && this.month - 1 > date.getMonth()) ||
        (this.year == date.getFullYear() &&
          this.month - 1 == date.getMonth() &&
          day > date.getDate())
      ) {
        return false;
      }

      return true;
    }

    return false;
  }
}
