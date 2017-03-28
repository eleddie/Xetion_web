import { Component, OnInit } from '@angular/core';
import { Headers, Http } from "@angular/http";
declare var swal: any;

@Component({
    selector: 'clinical-data',
    templateUrl: 'clinical-data.template.html'
})
export class ClinicalDataPage implements OnInit {
    private dateValue = new Date().toJSON().slice(0, 10).split("-").reverse().join("/");
    private hNumber;
    private name;
    private lastname;
    private reason;
    private currentSickness;
    private familyBackground;
    private personalBackground;
    private physicalTest;
    private medicalTest;
    private provisionalDiagnose;
    private initialTreatment;
    private plan;
    private additionalTests;

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.hNumber = localStorage.getItem("currentH");
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        headers.append("Content-Type", "application/json");

        this.http.get(`http://localhost:3001/api/clinical_data/${this.hNumber}`, {headers: headers}).map(res => res.json())
            .subscribe(response => {
                console.log(response);
                if (response.code == 1) {
                    this.name = response.response.name;
                    this.lastname = response.response.lastname;
                    if (response.response.clinical_data) {
                        this.reason = response.response.clinical_data.reason;
                        this.currentSickness = response.response.clinical_data.currentSickness;
                        this.familyBackground = response.response.clinical_data.familyBackground;
                        this.personalBackground = response.response.clinical_data.personalBackground;
                        this.physicalTest = response.response.clinical_data.physicalTest;
                        this.medicalTest = response.response.clinical_data.medicalTest;
                        this.provisionalDiagnose = response.response.clinical_data.provisionalDiagnose;
                        this.initialTreatment = response.response.clinical_data.initialTreatment;
                        this.plan = response.response.clinical_data.plan;
                        this.additionalTests = response.response.clinical_data.additionalTests;
                    }
                } else if (response.code == 302) {
                    swal('Oops...',
                        'No se encontró ningun registro',
                        'error');
                }

            });
    }
}
