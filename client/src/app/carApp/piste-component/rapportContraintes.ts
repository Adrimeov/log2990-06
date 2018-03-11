
export class RapportContraintes {

    public longueurRespectee: boolean;
    public angleRespectee: boolean;
    public nombreDeCroisement: number;

    public constructor() {
        this.longueurRespectee = true;
        this.angleRespectee = true;
        this.nombreDeCroisement = 0; // -1;
    }

    public get aucunCroisement(): boolean {
        return this.nombreDeCroisement === 0;
    }

    public get contraintesRespectees(): boolean {
        return this.longueurRespectee &&
               this.angleRespectee &&
               this.aucunCroisement;
    }
}
