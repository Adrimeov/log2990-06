import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { ServiceDeRendu } from "../serviceDeRendu/serviceDeRendu";
import { GestionnaireCamera } from "../camera/GestionnaireCamera";
import { GestionnaireScene } from "../scene/GestionnaireScene";
import { GestionnaireVoitures } from "../voiture/gestionnaireVoitures";

const ACCELERATEUR: number = 87;            // w
const DIRECTION_GAUCHE: number = 65;        // a
const FREIN: number = 83;                   // s
const DIRECTION_DROITE: number = 68;        // d
const CHANGER_VUE: number = 86;             // v
const ZOOM_OUT: number = 61;                // =
const ZOOM_IN: number = 173;                // -
const CHANGER_DECOR: number = 84;           // t
const CHANGER_HEURE_JOURNEE: number = 89;   // y

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private serviceDeRendu: ServiceDeRendu,
                       private gestionnaireCamera: GestionnaireCamera,
                       private gestionnaireVoitures: GestionnaireVoitures,
                       private gestionnaireScene: GestionnaireScene) { }

    @HostListener("window:resize", ["$event"])
    public redimensionnement(): void {
        this.serviceDeRendu.redimensionnement();
    }

    public ngAfterViewInit(): void {
        this.serviceDeRendu
            .initialiser(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATEUR:
                this.gestionnaireVoitures.voitureJoueur.isAcceleratorPressed = true;
                break;
            case DIRECTION_GAUCHE:
                this.gestionnaireVoitures.voitureJoueur.steerLeft();
                break;
            case DIRECTION_DROITE:
                this.gestionnaireVoitures.voitureJoueur.steerRight();
                break;
            case FREIN:
                this.gestionnaireVoitures.voitureJoueur.brake();
                break;
            case ZOOM_IN:
                this.gestionnaireCamera.zoomer();
                break;
            case ZOOM_OUT:
                this.gestionnaireCamera.dezoomer();
                break;
            default:
                break;
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATEUR:
                this.gestionnaireVoitures.voitureJoueur.isAcceleratorPressed = false;
                break;
            case DIRECTION_GAUCHE:
            case DIRECTION_DROITE:
                this.gestionnaireVoitures.voitureJoueur.releaseSteering();
                break;
            case FREIN:
                this.gestionnaireVoitures.voitureJoueur.releaseBrakes();
                break;
            case CHANGER_VUE:
                this.gestionnaireCamera.changerCamera();
                break;
            case CHANGER_DECOR:
                this.gestionnaireScene.changerDecor();
                break;
            case CHANGER_HEURE_JOURNEE:
                this.gestionnaireScene.changerTempsJournee();
                break;
            default:
                break;
        }
    }
}
