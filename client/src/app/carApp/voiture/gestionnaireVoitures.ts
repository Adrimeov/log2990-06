import { Injectable, Inject } from "@angular/core";
import { ObjectLoader, Object3D, Group, LoadingManager } from "three";
import { Voiture } from "../voiture/voiture";
import { GestionnaireClavier } from "../clavier/gestionnaireClavier";
import { EvenementClavier, TypeEvenementClavier } from "../clavier/evenementClavier";
import { UtilisateurPeripherique } from "../peripheriques/UtilisateurPeripherique";
import { ErreurChargementTexture } from "../../exceptions/erreurChargementTexture";
import { PisteJeu } from "../piste/pisteJeu";
import { ControleurVoiture } from "../controleurVoiture/controleurVoiture";
import { IObjetEnMouvement } from "./IObjetEnMouvement";
import { TempsJournee } from "../skybox/tempsJournee";
import { TEMPS_JOURNEE_INITIAL } from "../constants";

// AI
export const NOMBRE_AI: number = 1;

// Textures
const CHEMIN_TEXTURE: string = "../../../assets/voitures/";
const NOMS_TEXTURES: string[] = ["camero-2010-low-poly.json", "voiture-2010-low-poly.json"];

// Couleur voiture
enum CouleurVoiture { JAUNE = 0, ROSE = 1 }
const TEXTURE_DEFAUT_JOUEUR: CouleurVoiture = CouleurVoiture.ROSE;
const TEXTURE_DEFAUT_AI: CouleurVoiture = CouleurVoiture.JAUNE;

// Touches clavier
const ACCELERATEUR_APPUYE: EvenementClavier = new EvenementClavier("w", TypeEvenementClavier.TOUCHE_APPUYEE);
const ACCELERATEUR_RELEVE: EvenementClavier = new EvenementClavier("w", TypeEvenementClavier.TOUCHE_RELEVEE);
const DIRECTION_GAUCHE_APPUYEE: EvenementClavier = new EvenementClavier("a", TypeEvenementClavier.TOUCHE_APPUYEE);
const DIRECTION_GAUCHE_RELEVE: EvenementClavier = new EvenementClavier("a", TypeEvenementClavier.TOUCHE_RELEVEE);
const DIRECTION_DROITE_APPUYE: EvenementClavier = new EvenementClavier("d", TypeEvenementClavier.TOUCHE_APPUYEE);
const DIRECTION_DROITE_RELEVE: EvenementClavier = new EvenementClavier("d", TypeEvenementClavier.TOUCHE_RELEVEE);
const FREIN_APPUYE: EvenementClavier = new EvenementClavier("s", TypeEvenementClavier.TOUCHE_APPUYEE);
const FREIN_RELEVE: EvenementClavier = new EvenementClavier("s", TypeEvenementClavier.TOUCHE_RELEVEE);
const INTERRUPTEUR_LUMIERE: EvenementClavier = new EvenementClavier("l", TypeEvenementClavier.TOUCHE_RELEVEE);

@Injectable()
export class GestionnaireVoitures {

    private _voitureJoueur: Voiture;
    private _voituresAI: Voiture[];
    private controleursAI: ControleurVoiture[];
    private clavier: UtilisateurPeripherique;

    public get voitureJoueur(): Voiture {
        return this._voitureJoueur;
    }

    public get voituresAI(): Group {
        const groupe: Group = new Group();

        for (const voiture of this._voituresAI) {
            groupe.add(voiture);
        }

        return groupe;
    }

    public constructor(@Inject(GestionnaireClavier) gestionnaireClavier: GestionnaireClavier) {
        this._voituresAI = [];
        this.controleursAI = [];
        this.clavier = new UtilisateurPeripherique(gestionnaireClavier);
    }

    protected initialisationTouches(): void {
        this.clavier.ajouter(this._voitureJoueur.accelerer.bind(this._voitureJoueur), ACCELERATEUR_APPUYE);
        this.clavier.ajouter(this._voitureJoueur.relacherAccelerateur.bind(this._voitureJoueur), ACCELERATEUR_RELEVE);
        this.clavier.ajouter(this._voitureJoueur.virerGauche.bind(this._voitureJoueur), DIRECTION_GAUCHE_APPUYEE);
        this.clavier.ajouter(this._voitureJoueur.relacherVolant.bind(this._voitureJoueur), DIRECTION_GAUCHE_RELEVE);
        this.clavier.ajouter(this._voitureJoueur.virerDroite.bind(this._voitureJoueur), DIRECTION_DROITE_APPUYE);
        this.clavier.ajouter(this._voitureJoueur.relacherVolant.bind(this._voitureJoueur), DIRECTION_DROITE_RELEVE);
        this.clavier.ajouter(this._voitureJoueur.freiner.bind(this._voitureJoueur), FREIN_APPUYE);
        this.clavier.ajouter(this._voitureJoueur.relacherFreins.bind(this._voitureJoueur), FREIN_RELEVE);
        this.clavier.ajouter(this._voitureJoueur.changerEtatPhares.bind(this._voitureJoueur), INTERRUPTEUR_LUMIERE);
    }

    // Creation des voitures

    public initialiser(piste: PisteJeu): void {
        this.creerVoitureJoueur();
        this.creerVoituresAI(piste);
        this.initialisationTouches();
        this.changerTempsJournee(TEMPS_JOURNEE_INITIAL);
    }

    private creerVoitureJoueur(): void {
        this._voitureJoueur = new Voiture();
        this.chargerTexture(NOMS_TEXTURES[TEXTURE_DEFAUT_JOUEUR], this._voitureJoueur)
            .catch(() => { throw new ErreurChargementTexture(); });
    }

    private creerVoituresAI(piste: PisteJeu): void {
        for (let i: number = 0; i < NOMBRE_AI; i++) {
            this._voituresAI.push(new Voiture());
            this.chargerTexture(NOMS_TEXTURES[TEXTURE_DEFAUT_AI], this._voituresAI[i])
            .catch(() => { throw new ErreurChargementTexture(); });
            this.controleursAI.push(new ControleurVoiture(this._voituresAI[i], piste.exporter()));
        }
    }

    private async chargerTexture(URL_TEXTURE: string, voiture: Voiture): Promise<Object3D> {
        return new Promise<Object3D>((resolve) => {
                    new ObjectLoader(new LoadingManager()).load(
                        CHEMIN_TEXTURE + URL_TEXTURE,
                        (object) => voiture.initialiser(object));
               });
    }

    // Changements affectant les voitures

    public miseAJourVoitures(tempsDepuisDerniereTrame: number): void {
        for (const voiture of this.voituresEnMouvement) {
            voiture.miseAJour(tempsDepuisDerniereTrame);
        }
    }

    public changerTempsJournee(temps: TempsJournee): void {
        temps === TempsJournee.Jour
            ? this.eteindrePhares()
            : this.allumerPhares();
    }

    private eteindrePhares(): void {
        for (const voiture of this.voitures) {
            voiture.eteindrePhares();
        }
    }

    private allumerPhares(): void {
        for (const voiture of this.voitures) {
            voiture.allumerPhares();
        }
    }

    public get voitures(): Voiture[] {
        return this._voituresAI.concat([this._voitureJoueur]);
    }

    public get voituresEnMouvement(): IObjetEnMouvement[] {
        return (this.controleursAI as IObjetEnMouvement[]).concat([this._voitureJoueur]);
    }
}
