import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Mot } from "../mockObject/word";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class HttpeReqService {
  private url: string = "http://localhost:3000/grille/facile";

  public constructor(private http: HttpClient) { }

  public getWord(): Observable<Mot[] > {
    return this.http.get<Mot[]>(this.url);
  }

  public modifierRequete(nouvelleRequete: string): void {
    this.url = nouvelleRequete;
  }
}
