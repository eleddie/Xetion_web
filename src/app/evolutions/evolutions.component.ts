import { Component, OnInit } from '@angular/core';
import { Headers, Http } from "@angular/http";
declare var swal: any;

@Component({
    selector: 'evolutions',
    templateUrl: 'evolutions.template.html'
})
export class EvolutionsPage implements OnInit {
    private dateValue = new Date().toJSON().slice(0, 10).split("-").reverse().join("/");
    private hNumber;
    private name;
    private lastname;
    private observations;
    private additionalTests;
    private planEvo;
    private treatment;
    private evolutions: Array<any>;

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.evolutions = new Array<any>();
        this.hNumber = localStorage.getItem("currentH");
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        headers.append("Content-Type", "application/json");

        this.http.get(`http://localhost:3001/api/evolutions/${this.hNumber}`, {headers: headers}).map(res => res.json())
            .subscribe(response => {
                console.log(response);
                if (response.code == 1) {
                    this.name = response.response.name;
                    this.lastname = response.response.lastname;
                    this.evolutions = response.response.evolutions;
                } else if (response.code == 302) {
                    swal('Oops...',
                        'No se encontró ningun registro',
                        'error');
                }

            });
    }

    private save() {
        let body = {
            date: this.dateValue,
            observations: this.observations,
            additionalTests: this.additionalTests,
            planEvo: this.planEvo,
            treatment: this.treatment
        }

        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        headers.append("Content-Type", "application/json");

        this.http.post(`http://localhost:3001/api/evolutions/${this.hNumber}`, body, {headers: headers}).map(res => res.json())
            .subscribe(response => {
                console.log(response);

                if (response.code == 1) {
                } else if (response.code == 302) {

                }
            });
    }
}
