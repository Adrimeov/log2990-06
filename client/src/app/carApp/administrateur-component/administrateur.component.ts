import { Component, Inject } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { PisteBD } from "../piste/IPisteBD";
import { GestionnaireBDCourse } from "../baseDeDonnee/GestionnaireBDCourse";
import { AbstractListePisteComponent } from "../abstract-component/abstract.listePiste.component";

@Component({
    selector: "app-admin",
    templateUrl: "./administrateur.component.html",
    styleUrls: ["./administrateur.component.css"]
})
export class AdministrateurComponent extends AbstractListePisteComponent {

    public pistes: PisteBD[];
    public abonnementPistes: Subscription;

    public constructor(@Inject(GestionnaireBDCourse) gestionnaireBD: GestionnaireBDCourse) {
      super(gestionnaireBD);
    }

    public editerPiste(piste: PisteBD): void {
        this.gestionnaireBD.pisteEdition = piste;
    }

    public supprimerPiste(piste: PisteBD): void {
        this.gestionnaireBD.supprimerPiste(piste);
    }

    public creerNouvellePiste(): void {
        this.gestionnaireBD.pisteEdition = null;
    }
}
