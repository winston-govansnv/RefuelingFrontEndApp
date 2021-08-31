import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

export class Data {
    theatreId: number;
    movieId: number;
    price: number;
    startDate: Date;
    endDate: Date
}

export class TheatreData {
    text: string;
    id: number;
}


let theatreData: TheatreData[] = [{
    text: "xxxxxxx1",
    id: 0
}, {
    text: "xxxxxxxx2",
    id: 1
}
];



@Injectable()
export class Service {
    public datax: any;

    public http:HttpClient;
    public baseUrl:string;
    startDate:Date = new Date();
    endDate:Date= new Date();

    constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.http = http;
        this.baseUrl = baseUrl;
    }

    getData() {
        return this.datax;
    }
}
