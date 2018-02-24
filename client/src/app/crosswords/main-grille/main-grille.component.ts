import { Component, OnInit } from "@angular/core";
import { RequeteDeGrilleService } from "../service-Requete-de-Grille/requete-de-grille.service";

@Component({
  selector: "app-main-grille",
  templateUrl: "./main-grille.component.html",
  styleUrls: ["./main-grille.component.css"],
  providers: [ RequeteDeGrilleService ]

})
export class MainGrilleComponent implements OnInit {

  public constructor() { }

  public ngOnInit(): void { }
}
