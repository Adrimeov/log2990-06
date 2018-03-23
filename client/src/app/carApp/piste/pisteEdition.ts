import { Point } from "../elementsGeometrie/point";
import { DroiteAffichage } from "../elementsAffichage/editeur/droiteAffichage";
import { IntersectionPiste } from "../elementsAffichage/editeur/intersectionPiste";
import { VerificateurContraintesPiste } from "../editeurPiste/verificateurContraintesPiste";
import { PisteAbstraite } from "./pisteAbstraite";

export class PisteEdition extends PisteAbstraite {

    protected intersections: IntersectionPiste[];
    private intersectionSelectionnee: IntersectionPiste;
    private verificateurPiste: VerificateurContraintesPiste;

    public constructor() {
        super();
        this.intersections = [];
        this.intersectionSelectionnee = null;
        this.verificateurPiste = new VerificateurContraintesPiste(this.intersections);
    }

    public exporter(): Point[] {
      const points: Point[] = [];

      for (const intersection of this.intersections) {
           points.push(intersection.point);
      }

      return points;
    }

    public ajouterPoint(point: Point): void {
        if (this.estBoucle) {
            return;
        } else if (this.doitFermerCircuit(point)) {
            this.bouclerCircuit();
        } else {
            this.creerNouvelleIntersection(point);
        }
    }

    private doitFermerCircuit(point: Point): boolean {
        const DEUX: number = 2;

        return this.intersections.length > DEUX &&
               this.premiereIntersection.estEnContactAvec(point);
    }

    private bouclerCircuit(): void {
        this.premiereIntersection.bouclerAvec(this.derniereIntersection);
        this.verifierContraintesExtremites();
    }

    private debouclerCircuit(): void {
        this.premiereIntersection.separer(this.derniereIntersection);
        this.verifierContraintesExtremites();
    }

    private verifierContraintesExtremites(): void {
        if (this.contientPoints) {
            this.verificateurPiste.verifierContraintes(this.premiereIntersection);
            this.verificateurPiste.verifierContraintes(this.derniereIntersection);
        }
    }

    private creerNouvelleIntersection(point: Point): void {
        if (!this.estEnContactAvecAutresPoints(point)) {
            this.ajouterIntersection(
                new IntersectionPiste(this.obtenirDroiteArriveeNouveauPoint(point), point));
        }
    }

    private ajouterIntersection(intersection: IntersectionPiste): void {
        this.intersections.push(intersection);
        this.add(intersection);
        this.verificateurPiste.verifierContraintes(intersection);
    }

    private obtenirDroiteArriveeNouveauPoint(point: Point): DroiteAffichage {
        return this.droiteArriveeCourante !== null
            ? this.droiteArriveeCourante
            : new DroiteAffichage(point, point);
    }

    public miseAJourElementSelectionne(point: Point): void {
        if (this.intersectionSelectionnee !== null) {
            if (this.intersectionSelectionneePeutBoucler(point)) {
                this.fusionnerPoint(point);
                this.verifierContraintesExtremites();
            } else {
                this.intersectionSelectionnee.point = point;
                this.verificateurPiste.verifierContraintes(this.intersectionSelectionnee);
            }
        }
    }

    private intersectionSelectionneePeutBoucler(point: Point): boolean {
        return this.intersectionSelectionnee === this.derniereIntersection &&
               this.doitFermerCircuit(point) &&
               !this.estBoucle;
    }

    private fusionnerPoint(point: Point): void {
        this.retirerDernierPoint();
        this.ajouterPoint(point);
        this.intersectionSelectionnee = null;
    }

    public effacerPoint(): void {
        if (this.estBoucle) {
            this.debouclerCircuit();
        } else if (this.contientPoints) {
            this.retirerDernierPoint();
        }
    }

    private retirerDernierPoint(): void {
        this.remove(this.derniereIntersection);
        this.intersections.splice(-1);

        if (this.contientPoints) {
            this.derniereIntersection.ramenerDroiteDepart();
            this.verifierContraintesExtremites();
        }
    }

    protected get premiereIntersection(): IntersectionPiste {
        return this.contientPoints
            ? this.intersections[0]
            : null;
    }

    protected get derniereIntersection(): IntersectionPiste {
        return this.contientPoints
            ? this.intersections[this.intersections.length - 1]
            : null;
    }

    private get droiteArriveeCourante(): DroiteAffichage {
        return this.derniereIntersection !== null
         ? this.derniereIntersection.droiteDebut
         : null;
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

    public deselectionnerIntersection(): void {
        this.intersectionSelectionnee = null;
    }

    private estEnContactAvecAutresPoints(point: Point): boolean {
        for (const intersection of this.intersections) {
            if (intersection.estEnContactAvec(point)) {
                return true;
            }
        }

        return false;
    }

    public get estBoucle(): boolean {
        return this.premiereIntersection !== null && this.derniereIntersection !== null
            ? this.premiereIntersection.droiteArrivee === this.derniereIntersection.droiteDebut
            : false;
    }

    public estSensHoraire(): boolean {
        return this.estBoucle
            ? super.estSensHoraire()
            : null;
    }
}