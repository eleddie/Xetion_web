import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'select-patient',
    template: `
        <table class="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let patient of patients; let i = index" (click)="selectedPatient(i)">
              <th scope="row">{{patient.hnumber}}</th>
              <td>{{patient.name}}</td>
              <td>{{patient.lastname}}</td>
              <td>{{patient.dni}}</td>
            </tr>
          </tbody>
        </table>
`
})
export class SelectPatientComponent implements OnInit {
    @Input('patients') patients: Array<any>;
    @Output('selected') selected: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    selectedPatient(index) {
        this.selected.emit(this.patients[index]);
    }

}