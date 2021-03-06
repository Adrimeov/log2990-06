import { Injectable, Inject } from "@angular/core";
import { Scene, Vector3 } from "three";
import { IScene } from "./IScene";
import { GestionnaireSkybox } from "../skybox/gestionnaireSkybox";
import { GestionnaireVoitures } from "../voiture/gestionnaireVoitures";
import { EvenementClavier, TypeEvenementClavier } from "../clavier/evenementClavier";
import { GestionnaireClavier } from "../clavier/gestionnaireClavier";
import { UtilisateurPeripherique } from "../peripheriques/UtilisateurPeripherique";
import { PisteJeu } from "../piste/pisteJeu";
import { GestionnaireBDCourse } from "../baseDeDonnee/GestionnaireBDCourse";
import { TempsJournee } from "../skybox/tempsJournee";
import { TEMPS_JOURNEE_INITIAL } from "../constants";
import { PISTE_TEST } from "../piste/pisteTest";
import { Point } from "../elementsGeometrie/point";
import { SignalDepart } from "../signalDepart/signalDepart";
import { SonDepart } from "../son/SonDepart";

const CHANGER_DECOR: EvenementClavier = new EvenementClavier("t", TypeEvenementClavier.TOUCHE_RELEVEE);
const CHANGER_HEURE_JOURNEE: EvenementClavier = new EvenementClavier("n", TypeEvenementClavier.TOUCHE_RELEVEE);

@Injectable()
export class GestionnaireScene implements IScene {

    private _scene: Scene;
    private piste: PisteJeu;
    private tempsJournee: TempsJournee;
    private clavier: UtilisateurPeripherique;
    private signalDepart: SignalDepart;
    private sonDepart: SonDepart;

    public get scene(): Scene {
        return this._scene;
    }

    public constructor(private gestionnaireSkybox: GestionnaireSkybox,
                       private gestionnaireVoiture: GestionnaireVoitures,
                       @Inject(GestionnaireBDCourse) gestionnaireBDCourse: GestionnaireBDCourse,
                       @Inject(GestionnaireClavier) gestionnaireClavier: GestionnaireClavier) {
        this._scene = new Scene;
        this.clavier = new UtilisateurPeripherique(gestionnaireClavier);
        this.tempsJournee = TEMPS_JOURNEE_INITIAL;
        this.sonDepart = new SonDepart();
        this.initialisationTouches();
        this.initialisationPiste(gestionnaireBDCourse.pointsJeu);
        this.creerScene();
    }

    private initialisationPiste(points: Point[]): void {
        this.piste = new PisteJeu();
        this.piste.importer(points);

        if (!this.piste.estValide) {
            this.piste = new PisteJeu();
            this.piste.importer(PISTE_TEST);
        }
    }

    protected initialisationTouches(): void {
        this.clavier.ajouter(this.changerDecor.bind(this), CHANGER_DECOR);
        this.clavier.ajouter(this.miseAJourTempsJournee.bind(this), CHANGER_HEURE_JOURNEE);
    }

    private creerScene(): void {
        this.ajouterElements();
        this.avancerTemps();
        this.miseAJourTempsJournee();
        this.signalerDepart();
        this.choisirSceneAleatoire();

    }

    private choisirSceneAleatoire(): void {
        if (Math.round(Math.random())) {
            this.miseAJourTempsJournee();
        }
        this.gestionnaireSkybox.changerSkyboxAleatoire();
        this.changerDecor();
    }

    private ajouterElements(): void {
        this.gestionnaireVoiture.initialiser(this.piste);
        this._scene.add(this.gestionnaireVoiture.voituresAI);
        this._scene.add(this.piste);
        this._scene.add(this.gestionnaireSkybox.skybox);
        this._scene.add(this.gestionnaireVoiture.voitureJoueur);
    }

    private signalerDepart(): void {
        this.signalDepart = new SignalDepart(this.piste.zoneDeDepart, this.sonDepart);
        this._scene.add(this.signalDepart);
        this.signalDepart.demarrer();
    }

    public miseAJour(tempsDepuisDerniereTrame: number): void {
        if (this.signalDepart.estTermine) {
            this.gestionnaireVoiture.miseAJourVoitures(tempsDepuisDerniereTrame);
        }
    }

    public miseAJourTempsJournee(): void {
        this.avancerTemps();
        this._scene.remove(this.gestionnaireSkybox.skybox);
        this.gestionnaireSkybox.changerTempsJournee(this.tempsJournee);
        this._scene.add(this.gestionnaireSkybox.skybox);
        this.gestionnaireVoiture.changerTempsJournee(this.tempsJournee);
    }

    private avancerTemps(): void {
        this.tempsJournee === TempsJournee.Jour
            ? this.tempsJournee = TempsJournee.Nuit
            : this.tempsJournee = TempsJournee.Jour;
    }

    public changerDecor(): void {
        this._scene.remove(this.gestionnaireSkybox.skybox);
        this.gestionnaireSkybox.changerDecor();
        this._scene.add(this.gestionnaireSkybox.skybox);
    }

    public get obtenirPoints(): Point[] {
        return this.piste.exporter();
    }

    public get obtenirZoneDepart(): Vector3 {
        return this.piste.zoneDeDepart;
    }
}
