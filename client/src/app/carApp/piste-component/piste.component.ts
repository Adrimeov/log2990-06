import { Component, Inject } from "@angular/core";
import { AbstractGameComponent } from "../abstract-component/abstract.game.component";
import { ServiceDeRenduPistes } from "../serviceDeRendu/serviceDeRenduPistes";
import { GestionnaireClavier } from "../clavier/gestionnaireClavier";
import { GestionnaireEcran } from "../ecran/gestionnaireEcran";
import { GestionnaireSouris } from "../souris/gestionnaireSouris";
import { GestionnaireBDCourse } from "../baseDeDonnee/GestionnaireBDCourse";
import { GestionnaireEditionPiste } from "../editeurPiste/gestionnaireEditionPiste";

@Component({
    moduleId: module.id,
    selector: "app-piste-component",
    templateUrl: "./piste.component.html",
    styleUrls: ["./piste.component.css"]
})

export class PisteComponent extends AbstractGameComponent {

    public nom: string;
    public description: string;

    public constructor(private editeurPiste: GestionnaireEditionPiste,
                       @Inject(ServiceDeRenduPistes) serviceDeRendu: ServiceDeRenduPistes,
                       @Inject(GestionnaireClavier) gestionnaireClavier: GestionnaireClavier,
                       @Inject(GestionnaireEcran) gestionnaireEcran: GestionnaireEcran,
                       @Inject(GestionnaireSouris) gestionnaireSouris: GestionnaireSouris,
                       @Inject(GestionnaireBDCourse) gestionnaireBD: GestionnaireBDCourse) {
        super(serviceDeRendu, gestionnaireClavier, gestionnaireEcran, gestionnaireSouris);

        if (gestionnaireBD.pisteEdition !== null) {
            this.nom = gestionnaireBD.pisteEdition.nom;
            this.description = gestionnaireBD.pisteEdition.description;
        }
    }

    public creerNouvellePiste(): void {
        this.editeurPiste.creerNouvellePiste(this.nom, this.description);
    }

    public mettreAJourPiste(): void {
        this.editeurPiste.mettreAJourPiste();
    }

}
