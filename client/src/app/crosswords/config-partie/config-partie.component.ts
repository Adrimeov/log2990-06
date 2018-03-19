import { Component, OnInit } from "@angular/core";
import { ServiceHttp } from "../serviceHttp/http-request.service";
import { ServiceSocketService } from "../service-socket/service-socket.service";
import { Difficulte } from "../../../../../common/communication/IConfigurationPartie";
import { Router } from "@angular/router";

export const REQUETE_INIT: string = "http://localhost:3000/grille/";

@Component({
    selector: "app-config-partie",
    templateUrl: "./config-partie.component.html",
    styleUrls: ["./config-partie.component.css"]
})
export class ConfigPartieComponent implements OnInit {

    // private estCreateurPartie: boolean;
    private nomPartie: string;
    private difficultee: string;
    private listePartie: string[];

    public constructor(private serviceHTTP: ServiceHttp, private serviceSocket: ServiceSocketService, private router: Router) {
        this.listePartie = [
            "Salle_1", // TEST
            "Salle_2",
            "Salle_3"
        ];
    }

    public ngOnInit(): void { }

    public apparaitreSection(laSection: string): void {
        document.getElementById(laSection).classList.remove("pasVisible");
        document.getElementById(laSection).classList.add("visible");
    }

    public disparaitreSection(laSection: string): void {
        document.getElementById(laSection).classList.remove("visible");
        document.getElementById(laSection).classList.add("pasVisible");
    }

    public ajouterDifficulte(difficulte: Difficulte): void {
        this.difficultee = difficulte;
        if (difficulte !== undefined) {
            this.serviceHTTP.difficulte = difficulte;
        }
    }

    private commencerPartie(): void {
        this.serviceSocket.chargementComplete().subscribe(() => {
            this.router.navigateByUrl("/CrosswordsGame");
        });
    }

    public creerPartie(): void {
        this.serviceSocket.creerPartie(this.nomPartie, this.difficultee);
        this.commencerPartie();
    }

    public demmanderListe(): void {
        this.serviceSocket.rejoindrePartie();
    }

    public enterKeyPress(touche: KeyboardEvent, section: string): void {
        if (touche.key === "Enter") {
            // Encore une fois ici, tslint dit que value existe pas.. pourtant
            // c'est une propriété angular
            this.nomPartie = touche.target.value;
            this.apparaitreSection(section);
            this.disparaitreSection("inputNomPartie");
        }
    }

}
