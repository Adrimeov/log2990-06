import { Group, Vector3 } from "three";
import { IntersectionPiste } from "./elementsGeometrie/intersectionPiste";
import { Point } from "./elementsGeometrie/Point";
import { DroiteAffichage } from "./elementsGeometrie/droiteAffichage";
import { VerificateurContraintesPiste } from "./elementsGeometrie/verificateurContraintesPiste";

export class Piste extends Group {

    private intersections: IntersectionPiste[];
    private circuitBoucle: boolean;
    private intersectionSelectionnee: IntersectionPiste;
    private verificateurPiste: VerificateurContraintesPiste;

    public constructor() {
        super();
        this.intersections = [];
        this.circuitBoucle = false;
        this.intersectionSelectionnee = null;
        this.verificateurPiste = new VerificateurContraintesPiste(this.intersections);
    }

    public ajouterPoint(point: Point): void {
        if (this.circuitBoucle) {
            return;
        } else if (this.doitFermerCircuit(point)) {
            this.bouclerCircuit();
        } else {
            this.creerNouvelleIntersection(point);
        }
    }

    private doitFermerCircuit(point: Point): boolean {
        const DEUX: number = 2;

        return !this.creationPremierPoint && this.premiereIntersection.estEnContactAvec(point) && this.intersections.length > DEUX;
    }

    private bouclerCircuit(): void {
        this.circuitBoucle = true;
        this.premiereIntersection.droiteArrivee = this.derniereIntersection.droiteDebut;
        this.derniereIntersection.droiteDebut.miseAJourArrivee(this.premierPoint);
        this.verificateurPiste.verifierContraintes(this.premiereIntersection);
        this.verificateurPiste.verifierContraintes(this.derniereIntersection);
    }

    private debouclerCircuit(): void {
        this.circuitBoucle = false;
        this.premiereIntersection.ramenerDroiteArrivee();
        this.derniereIntersection.ramenerDroiteDebut();
    }

    private creerNouvelleIntersection(point: Point): void {
        if (this.derniereIntersection === null || !this.estEnContactAvecAutresPoints(point)) {
            const intersection: IntersectionPiste = new IntersectionPiste(this.obtenirDroiteArriveeNouveauPoint(point),
                                                                          point, this.creationPremierPoint);
            this.intersections.push(intersection);
            this.add(intersection);
            this.verificateurPiste.verifierContraintes(intersection);
        }
    }

    private obtenirDroiteArriveeNouveauPoint(point: Point): DroiteAffichage {
        return this.droiteArriveeCourante !== null
            ? this.droiteArriveeCourante
            : new DroiteAffichage(point, point);
    }

    public miseAJourElementSelectionne(point: Point): void {
        if (this.intersectionSelectionnee !== null) {
            this.intersectionSelectionnee.miseAJourPoint(point);
            this.verificateurPiste.verifierContraintes(this.intersectionSelectionnee);
        }
    }

    public effacerPoint(point: Point): void {
        if (this.circuitBoucle) {
            this.debouclerCircuit();
        } else if (!this.creationPremierPoint) {
            this.remove(this.derniereIntersection);
            this.intersections.splice(-1);
        }
    }

    private get premiereIntersection(): IntersectionPiste {
        return this.intersections[0];
    }

    private get derniereIntersection(): IntersectionPiste {
        return this.intersections.length - 1 >= 0
            ? this.intersections[this.intersections.length - 1]
            : null;
    }

    private get droiteArriveeCourante(): DroiteAffichage {
        return this.derniereIntersection !== null
         ? this.derniereIntersection.droiteDebut
         : null;
    }

    private get creationPremierPoint(): boolean {
        return this.intersections.length === 0;
    }

    private get premierPoint(): Point {
        return this.premiereIntersection.point.point;
    }

    public selectionnerIntersection(point: Point): void {
        for (const intersection of this.intersections) {
            if (intersection.estEnContactAvec(point)) {
                this.intersectionSelectionnee = intersection;

                return;
            }
        }

        this.intersectionSelectionnee = null;
    }

    public deselectionnerElement(): void {
        this.intersectionSelectionnee = null;
    }

    private estEnContactAvecAutresPoints(point: Point): boolean {
        for (const intertsection of this.intersections) {
            if (intertsection.estEnContactAvec(point)) {
                return true;
            }
        }

        return false;
    }

    // Source : https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
    public get estSensHoraire(): boolean {
        if (!this.circuitBoucle) {
            return null;
        }

        let somme: number = 0;
        for (let i: number = 0 ; i < this.intersections.length ; i++) {
            const pointActuel: Point = this.intersections[i].point.point;
            const pointSuivant: Point = this.intersections[(i + 1) % this.intersections.length].point.point;
            somme += (pointSuivant.x - pointActuel.x) * (pointSuivant.y + pointActuel.y);
        }

        return somme > 0;
    }

    public get zoneDeDepart(): Vector3 {
        const DEUX: number = 2;

        return this.intersections.length >= DEUX
            ? this.premiereIntersection.droiteDebut.droite.getCenter()
            : null;
    }
}
