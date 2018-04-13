import { GestionnaireVoitures, NOMBRE_AI } from "./gestionnaireVoitures";
import { GestionnaireClavier } from "../clavier/gestionnaireClavier";
import { PisteJeu } from "../piste/pisteJeu";
import { TempsJournee } from "../skybox/tempsJournee";
import { PISTE_TEST } from "../piste/pisteTest";

const PISTE_JEU: PisteJeu = new PisteJeu();
PISTE_JEU.importer(PISTE_TEST);

describe("GestionnaireVoitures", () => {
    let gestionnaire: GestionnaireVoitures;

    beforeEach(() => {
        gestionnaire = new GestionnaireVoitures(new GestionnaireClavier());
        gestionnaire.initialiser(PISTE_JEU);

    });

    it("Constructeur initialise un gestionnaire", () => {
        expect(gestionnaire).toBeDefined();
    });

    it("miseAJourVoitures", () => {
        expect(true).toBeTruthy();
    });

    it("changerTempsJournee change mode nuit", () => {
        const temps: TempsJournee = TempsJournee.Nuit;
        spyOn(gestionnaire["_voitureJoueur"], "allumerPhares");
        gestionnaire.changerTempsJournee(temps);
        expect(gestionnaire["_voitureJoueur"].allumerPhares).toHaveBeenCalled();
    });

    it("changerTempsJournee change mode jour", () => {
        const temps: TempsJournee = TempsJournee.Jour;
        spyOn(gestionnaire["_voitureJoueur"], "eteindrePhares");
        gestionnaire.changerTempsJournee(temps);
        expect(gestionnaire["_voitureJoueur"].eteindrePhares).toHaveBeenCalled();
    });

    it("get voitureJoueur renvoie un objet", () => {
        expect(gestionnaire.voitureJoueur).toBeDefined();
    });

    it("get voituresAI renvoie un groupe contenant les voitures AI", () => {
        expect(gestionnaire.voituresAI.children.length).toBe(NOMBRE_AI);
    });

    it("Position des voitures est aléatoire", () => {
        const tableauPlaces: number[] = [0, 0, 0, 0];
        for (let i: number = 0; i < 10000; i++) {
            const place: number = gestionnaire["placeAleatoire"]();
            tableauPlaces[place]++;
        }
        for (let j: number = 0; j < 4; j++) {
            expect(tableauPlaces[j] / 10000).toBeGreaterThan(0.24);
        }
    });
});
