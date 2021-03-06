import { Component, Inject } from "@angular/core";
import { PisteBD } from "../piste/IPisteBD";
import { GestionnaireBDCourse } from "../baseDeDonnee/GestionnaireBDCourse";
import { AbstractListePisteComponent } from "../abstract-component/abstract.listePiste.component";
import { ErreurIncrementerNbFoisJoue } from "../../exceptions/erreurIncrementerNbFoisJoue";

@Component({
    selector: "app-choix-course",
    templateUrl: "./choixCourse.component.html",
    styleUrls: ["./choixCourse.component.css"]
})
export class ChoixCourseComponent extends AbstractListePisteComponent {

    public constructor(@Inject(GestionnaireBDCourse) gestionnaireBD: GestionnaireBDCourse) {
        super(gestionnaireBD);
    }

    public choisirCourse(piste: PisteBD): void {
        if (piste !== undefined) {
            this.gestionnaireBD.pisteJeu = piste;
        }
        this.gestionnaireBD.incrementerNbFoisJouePiste(piste).catch( () => { throw new ErreurIncrementerNbFoisJoue; });
    }
}
