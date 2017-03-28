import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'profile-picture',
    templateUrl: 'profile-picture.template.html',
    styles: [`
            .image{
                height: 250px;
                width: 250px;
                padding: 0.5em;
            }
            .hover{
                position: absolute;
                background-color: rgba(43,43,43,0.5);
                height: 250px;
                width: 250px;
                left: 15px;
                top: 0;
                line-height: 250px;
                cursor: pointer;
            }
            `]
})
export class ProfilePictureComponent implements OnInit {

    private over = false;

    constructor() {
    }

    ngOnInit() {

    }
}
