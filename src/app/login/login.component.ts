import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Router } from "@angular/router";

@Component({
    selector: 'login',
    styleUrls: ['./login.style.scss'],
    templateUrl: './login.template.html',
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'login-page app'
    }
})
export class Login {

    private username = "";
    private password = "";
    private errorLogin = false;
    private logginIn = false;

    constructor(private http: Http, private router: Router) {

    }

    onLogin() {
        if (this.logginIn) return;
        this.logginIn = true;
        this.errorLogin = false;
        var body = {
            username: this.username,
            password: this.password
        };

        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        this.http.post("http://localhost:3001/api/auth", body, {headers: headers}).map(res => res.json())
            .subscribe(response => {
                this.logginIn = false;
                console.log(response);
                if (response.code == 1) {
                    localStorage.setItem("token", response.response.token);
                    localStorage.setItem("user", JSON.stringify(response.response.user));
                    this.router.navigate(['/app/dashboard']);
                } else {
                    this.errorLogin = true;
                }
            });
    }
}
