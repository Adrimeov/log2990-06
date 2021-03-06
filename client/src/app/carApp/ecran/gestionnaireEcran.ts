export class GestionnaireEcran {

    private conteneur: HTMLDivElement;

    public constructor() {
        this.conteneur = document.createElement("div");
    }

    public get largeur(): number {
        return this.conteneur.clientWidth;
    }

    public get hauteur(): number {
        return this.conteneur.clientHeight;
    }

    public get ratio(): number {
        return this.largeur / this.hauteur;
    }

    public initialiserConteneur(container: HTMLDivElement): void {
        if (container) {
            this.conteneur = container;
        }
    }

    public ajouterElementConteneur(element: HTMLElement): void {
        this.conteneur.appendChild(element);
    }

    public estLaBonneCible(element: EventTarget): boolean {
        return element instanceof HTMLCanvasElement
            ? this.estMemeDimensionQue(element)
            : false;
    }

    private estMemeDimensionQue(element: HTMLCanvasElement): boolean {
        return this.hauteur === element.clientHeight &&
               this.largeur === element.clientWidth;
    }
}
