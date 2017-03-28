import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Layout } from "../layout/layout.component";
import { ModalComponent } from "ng2-bs3-modal/components/modal";
import { Observable } from "rxjs";

declare var swal: any;

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})
export class Dashboard implements OnInit, OnDestroy {
    @ViewChild("modalSearch") searchModal: ModalComponent;

    public static startSearchEvent: EventEmitter<any> = new EventEmitter<any>();

    private lastHNumber;
    private hNumber: number = 1;

    private name = "";
    private lastname = "";
    private dniValue = "";
    private bDateValue = "";
    private occupation = "";
    private gender = "";
    private marital = "";
    private address = "";
    private state = "";
    private city = "";
    private zip = "";
    private insurance = "";
    private referred = "";
    private email = "";

    private dniMask = {
        mask: [/['V''v''E''e''P''p']/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        guide: false,
    };

    private bDateMask = {
        mask: [/[0-3]/, /\d/, '/', /[0-1]/, /\d/, '/', /[1-2]/, /[90]/, /[3-90]/, /\d/],
        guide: false,
    };

    private ageData;
    private exonerated = "no";
    private alive = "yes";

    private searchResults;
    public static fromSearch = null;

    constructor(private http: Http) {
    }


    private searchEvent(search) {
        console.log(search)
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        headers.append("Content-Type", "application/json");

        this.http.get(`http://localhost:3001/api/search_patient/${search.value}?by=${search.by}`, {headers: headers}).map(res => res.json())
            .subscribe(response => {
                if (response.code == 1) {
                    if (response.response.length == 1) {
                        this.setPatientData(response.response[0]);
                    } else {
                        this.searchResults = response.response;
                        this.searchModal.open();
                    }
                } else if (response.code == 302) {
                    swal('Oops...',
                        'No se encontró ningun registro',
                        'error');
                }

            });
        Dashboard.fromSearch = null;
    }

    ngOnInit() {
        Dashboard.startSearchEvent = new EventEmitter<any>();
        Dashboard.startSearchEvent.subscribe(search => {
            this.searchEvent(search);
        });

        var currentH = localStorage.getItem("currentH");
        if (currentH) {
            this.searchEvent({value: currentH, by: "2"});
            return;
        }

        if (Dashboard.fromSearch) {
            this.searchEvent(Dashboard.fromSearch);
            return;
        }

        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        this.http.get("http://localhost:3001/api/last_patient", {headers: headers}).map(res => res.json())
            .subscribe(response => {
                if (response.code == 1) {
                    if (!response.response) {
                        this.lastHNumber = 0;
                    } else {
                        this.lastHNumber = response.response.hnumber;
                        this.setPatientData(response.response);

                    }
                } else {
                    //TODO code != 1
                }
            });

    }

    ngOnDestroy() {
        //Dashboard.startSearchEvent.unsubscribe();
    }

    private setPatientData(data) {
        this.searchResults = null;
        this.name = data.name;
        this.lastname = data.lastname;
        this.hNumber = data.hnumber;
        this.dniValue = data.dni;
        this.bDateValue = data.bdate;
        this.occupation = data.occupation;
        this.gender = data.gender;
        this.marital = data.marital;
        this.address = data.address;
        this.state = data.state;
        this.city = data.city;
        this.zip = data.zip;
        this.insurance = data.insurance;
        this.referred = data.referred;
        this.email = data.email;
        this.getAge();
        localStorage.setItem("currentH", "" + this.hNumber);
    }


    upperCaseFirst(value) {
        if (value.length < 3)
            value = value.charAt(0).toUpperCase() + value.substring(1);
        return value;
    }

    updateBDateMask() {
        //if length == 10 calculate age
        if (this.bDateValue.length == 10)
            this.getAge();
        else
            this.ageData = null;

        //if Day starts with 3 it can only be followed by 0 or 1
        if (this.bDateValue.charAt(0) == '3')
            this.bDateMask.mask[1] = /[0-1]/;
        else {//Otherwise if stars with 0, 1 or 2 it can be followed by any
            this.bDateMask.mask[1] = /\d/;
        }

        //Month starts with 1 it can only be followed by 0, 1 or 2
        if (this.bDateValue.charAt(3) == '1')
            this.bDateMask.mask[4] = /[0-2]/;
        else {//Otherwise if stars with 0 it can be followed by any
            this.bDateMask.mask[4] = /\d/;
        }

        //Year starts with 1 it can only be followed by 9, then from 2 to 9, then any
        if (this.bDateValue.charAt(6) == '1') {
            this.bDateMask.mask[7] = /[9]/;
            this.bDateMask.mask[8] = /[2-9]/;
        } else {//Otherwise if stars with 2 it can only be followed by 0, then from 0 to 2, then any
            this.bDateMask.mask[7] = /[0]/;
            this.bDateMask.mask[8] = /[0-2]/;
        }


    }


    private updateCurrent(dir: number) {
        if (this.hNumber + dir > this.lastHNumber) {
            this.createNewPatient();
            return;
        }
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        this.http.get("http://localhost:3001/api/patients/" + (this.hNumber + dir), {headers: headers}).map(res => res.json())
            .subscribe(response => {
                if (response.code == 1) {
                    if (response.response) {
                        this.hNumber += dir;
                        this.setPatientData(response.response);
                    }
                } else {

                }
            });
    }


    private createNewPatient() {
        this.name = "";
        this.lastname = "";
        this.hNumber = this.lastHNumber + 1;
        this.dniValue = "";
        this.bDateValue = "";
        this.occupation = "";
        this.gender = "";
        this.marital = "";
        this.address = "";
        this.state = "";
        this.city = "";
        this.zip = "";
        this.insurance = "";
        this.referred = "";
        this.email = "";
        this.ageData = null;
    }

    private save() {
        var body = {
            name: this.name,
            lastname: this.lastname,
            hnumber: this.hNumber,
            dni: this.dniValue,
            bdate: this.bDateValue,
            occupation: this.occupation,
            gender: this.gender,
            marital: this.marital,
            address: this.address,
            state: this.state,
            city: this.city,
            zip: this.zip,
            insurance: this.insurance,
            referred: this.referred,
            email: this.email,
        };

        let headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        headers.append("Content-Type", "application/json");

        if (this.hNumber > this.lastHNumber) {
            this.http.post("http://localhost:3001/api/patients", body, {headers: headers}).map(res => res.json())
                .subscribe(response => {
                    if (response.code == 1) {
                        if (response.response) {
                            Layout.messageEvent.emit({
                                title: "Paciente Creado",
                                message: `El paciente #${this.hNumber} ha sido creado exitosamente`,
                                type: "success"
                            });
                            this.lastHNumber++;
                        }
                    }
                });
        } else {
            this.http.put("http://localhost:3001/api/patients/" + this.hNumber, body, {headers: headers}).map(res => res.json())
                .subscribe(response => {
                    if (response.code == 1) {
                        Layout.messageEvent.emit({
                            title: "Paciente Editado",
                            message: `El paciente #${this.hNumber} ha sido editado exitosamente`,
                            type: "success"
                        });
                    }
                });
        }

    }

    private getAge() {
        var sepDate = this.bDateValue.split("/");
        var date = new Date();
        var age = date.getFullYear() - +sepDate[2];
        var isBday = false;

        //if bd month is bigger than current, still to go, age--
        if (+sepDate[1] > date.getMonth() + 1) {
            age--;
            //if bd month is same as current, check if date is bigger
        } else if (+sepDate[1] == date.getMonth() + 1) {
            //if bd day is bigger, still to go, age--
            if (+sepDate[0] > date.getDate())
                age--;
        }


        if (date.getDate() == +sepDate[0] && date.getMonth() + 1 == +sepDate[1]) {
            isBday = true;
            Layout.messageEvent.emit({
                title: "¡Feliz Cumpleaños!",
                message: `Hoy es el cumpleaños #${age} de ${this.name}.
                            No olvides felicitarl${this.gender == "Male" ? 'o' : this.gender == "Female" ? 'a' : 'e'}!`,
                type: "info"
            });
        }

        this.ageData = {age: age, isBday: isBday};

    }

}
