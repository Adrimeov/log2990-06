// Classe de test pour les options de jeu

export class MockOptionPartie {

    private niveauDifficultee: string;
    private nombreDeJoueurs: number;

    public constructor (niveau: string, nbJoueurs: number) {
        this.niveauDifficultee = niveau;
        this.nombreDeJoueurs = nbJoueurs;
    }

    public get niveau(): string {
        return this.niveauDifficultee;
    }

    public get nbJoueurs(): number {
        return this.nombreDeJoueurs;
    }

    public setDifficultee(nouvelleDiff: string): void {
        this.niveauDifficultee = nouvelleDiff;
    }

}
