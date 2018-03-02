import { Injectable, OnDestroy } from "@angular/core";
import { ObjectLoader, Object3D } from "three";
import { Voiture } from "../voiture/voiture";
import { TempsJournee } from "../skybox/skybox";
import { GestionnaireClavier } from "../clavier/gestionnaireClavier";
import { EvenementClavier, TypeEvenementClavier, FonctionTouche } from "../clavier/evenementClavier";

// AI
const NOMBRE_AI: number = 1;

// Textures
const CHEMIN_TEXTURE: string = "../../../assets/voitures/";
const NOMS_TEXTURES: string[] = ["camero-2010-low-poly.json", "voiture-2010-low-poly.json"];
const TEXTURE_DEFAUT_JOUEUR: number = 1;

// Touches clavier
const ACCELERATEUR_APPUYE: EvenementClavier = new EvenementClavier("w", TypeEvenementClavier.TOUCHE_APPUYEE);
const ACCELERATEUR_RELEVE: EvenementClavier = new EvenementClavier("w", TypeEvenementClavier.TOUCHE_RELEVEE);
const DIRECTION_GAUCHE_APPUYEE: EvenementClavier = new EvenementClavier("a", TypeEvenementClavier.TOUCHE_APPUYEE);
const DIRECTION_GAUCHE_RELEVE: EvenementClavier = new EvenementClavier("a", TypeEvenementClavier.TOUCHE_RELEVEE);
const DIRECTION_DROITE_APPUYE: EvenementClavier = new EvenementClavier("d", TypeEvenementClavier.TOUCHE_APPUYEE);
const DIRECTION_DROITE_RELEVE: EvenementClavier = new EvenementClavier("d", TypeEvenementClavier.TOUCHE_RELEVEE);
const FREIN_APPUYE: EvenementClavier = new EvenementClavier("s", TypeEvenementClavier.TOUCHE_APPUYEE);
const FREIN_RELEVE: EvenementClavier = new EvenementClavier("s", TypeEvenementClavier.TOUCHE_RELEVEE);

@Injectable()
export class GestionnaireVoitures implements OnDestroy {

    private _voitureJoueur: Voiture;
    private _voituresAI: Voiture[];
    private touchesEnregistrees: FonctionTouche[];

    public get voitureJoueur(): Voiture {
        return this._voitureJoueur;
    }

    public get voituresAI(): Voiture[] {
        return this._voituresAI;
    }

    public constructor(private gestionnaireClavier: GestionnaireClavier) {
        this._voituresAI = [];
        this.touchesEnregistrees = [];
        this.initialiser().catch(() => new Error("Erreur lors de l'initialisation"));
        this.initialisationTouches();
    }

    public ngOnDestroy(): void {
        this.desinscriptionTouches();
    }

    private initialisationTouches(): void {
        this.creationTouches();
        this.inscriptionTouches();
    }

    private creationTouches(): void {
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.accelerer.bind(this._voitureJoueur), ACCELERATEUR_APPUYE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.accelerer.bind(this._voitureJoueur), ACCELERATEUR_APPUYE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.relacherAccelerateur.bind(this._voitureJoueur), ACCELERATEUR_RELEVE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.virerGauche.bind(this._voitureJoueur), DIRECTION_GAUCHE_APPUYEE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.relacherVolant.bind(this._voitureJoueur), DIRECTION_GAUCHE_RELEVE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.virerDroite.bind(this._voitureJoueur), DIRECTION_DROITE_APPUYE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.relacherVolant.bind(this._voitureJoueur), DIRECTION_DROITE_RELEVE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.freiner.bind(this._voitureJoueur), FREIN_APPUYE));
        this.touchesEnregistrees.push(
            new FonctionTouche(this._voitureJoueur.relacherFreins.bind(this._voitureJoueur), FREIN_RELEVE));
    }

    private inscriptionTouches(): void {
        for (const touche of this.touchesEnregistrees) {
            this.gestionnaireClavier.inscrire(touche);
        }
    }

    private desinscriptionTouches(): void {
        for (const touche of this.touchesEnregistrees) {
            this.gestionnaireClavier.desinscrire(touche);
        }
    }

    // Creation des voitures

    private async initialiser(): Promise<void> {
        this.creerVoitureJoueur().catch(() => new Error("Erreur construction de la voiture du joueur"));
        this.creerVoituresAI().catch(() => new Error("Erreur construction des voituresAI"));
    }

    private async creerVoitureJoueur(): Promise<void> {
        this._voitureJoueur = new Voiture();
        this._voitureJoueur.initialiser(await this.chargerTexture(NOMS_TEXTURES[TEXTURE_DEFAUT_JOUEUR]));
    }

    private async creerVoituresAI(): Promise<void> {
        for (let i: number = 0; i < NOMBRE_AI; i++) {
            this._voituresAI.push(new Voiture());
            this._voituresAI[i].initialiser(await this.chargerTexture(NOMS_TEXTURES[i % NOMS_TEXTURES.length]));
        }
    }

    private async chargerTexture(URL_TEXTURE: string): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(CHEMIN_TEXTURE + URL_TEXTURE, (object) => {
                resolve(object);
            });
        });
    }

    // Changements affectant les voitures

    public miseAJourVoitures(tempsDepuisDerniereTrame: number): void {
            this.voitureJoueur.update(tempsDepuisDerniereTrame);

            for (const voiture of this._voituresAI) {
                voiture.update(tempsDepuisDerniereTrame);
            }
    }

    public changerTempsJournee(temps: TempsJournee): void {
        if (temps === TempsJournee.Jour) {
            for (const voiture of this.voitures) {
                voiture.eteindrePhares();
            }
        } else {
            for (const voiture of this.voitures) {
                voiture.allumerPhares();
            }
        }
    }

    public get voitures(): Voiture[] {
        return this._voituresAI.concat([this._voitureJoueur]);
    }
}
