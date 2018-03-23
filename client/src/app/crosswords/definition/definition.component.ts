import { Component, OnInit } from "@angular/core";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Subscription } from "rxjs/Subscription";
import { ServiceInteractionComponent } from "../service-interaction-component/service-interaction-component";
import { Mot } from "../objetsTest/mot";
import { LettreGrille } from "../objetsTest/lettreGrille";

@Component({
  selector: "app-definition",
  templateUrl: "./definition.component.html",
  styleUrls: ["./definition.component.css"]
})

export class DefinitionComponent implements OnInit, OnDestroy {
  private mots: Mot[];
  private matriceDesMotsSurGrille: Array<Array<LettreGrille>>;

  private subscriptionMots: Subscription;
  private subscriptionMatrice: Subscription;
  private subscriptionMotSelec: Subscription;

  private motSelectionne: Mot;

  public constructor(private listeMotsService: ServiceInteractionComponent) {
    this.mots = this.listeMotsService.mots;
    this.matriceDesMotsSurGrille = this.listeMotsService.matrice;

    this.initialiserSouscriptions();
  }

  public ngOnInit(): void { }

  public ngOnDestroy(): void {
    this.subscriptionMots.unsubscribe();
    this.subscriptionMatrice.unsubscribe();
    this.subscriptionMotSelec.unsubscribe();
  }

  // Souscriptions

  private initialiserSouscriptions(): void {
    this.souscrireReceptionMots();
    this.souscrireSelectionMots();
    this.souscrireReceptionMatrice();
  }

  private souscrireReceptionMots(): void {
    this.subscriptionMots = this.listeMotsService.serviceReceptionMots()
      .subscribe((mots) => this.mots = mots);
  }

  private souscrireSelectionMots(): void {
    this.subscriptionMotSelec = this.listeMotsService.serviceReceptionMotSelectionne().subscribe((motSelect) => {
      this.motSelectionne = motSelect;
      this.miseAJourMotSelectionne(this.motSelectionne);
    });
  }

  private souscrireReceptionMatrice(): void {
    this.subscriptionMatrice = this.listeMotsService.serviceReceptionMatriceLettres()
      .subscribe((matrice) => this.matriceDesMotsSurGrille = matrice);
  }

  // Changement d'un mot

  public changementMotSelectionne(mot: Mot): void {
    if (!mot.motTrouve) {
      this.miseAJourMotSelectionne(mot);
      this.envoieMotSelectionne();
    }
  }

  private envoieMotSelectionne(): void {
    this.listeMotsService.serviceEnvoieMotSelectionne(this.motSelectionne);
  }

  private miseAJourMotSelectionne(mot: Mot): void {
    this.changementMot(mot);
    this.decouvrirCases(mot);
  }

  private changementMot(mot: Mot): void {
    this.mots.forEach((element: Mot) => element.activer = false);
    this.motSelectionne = mot;
    mot.activer = !mot.activer;
  }

  private decouvrirCases(mot: Mot): void {
    this.cacherCases();
    for (let indice: number = 0; indice < mot.longueur; indice++) {
      mot.estVertical
        ? this.obtenirLettreGrilleMotVertical(mot, indice).caseDecouverte = true
        : this.obtenirLettreGrilleMotHorizontal(mot, indice).caseDecouverte = true;
    }
    this.envoieMatrice();
  }

  private cacherCases(): void {
    for (const ligne of this.matriceDesMotsSurGrille) {
      for (const lettre of ligne) {
        lettre.caseDecouverte = false;
      }
    }
  }

  private obtenirLettreGrilleMotVertical(mot: Mot, indice: number): LettreGrille {
    return this.matriceDesMotsSurGrille[mot.premierX][indice + mot.premierY];
  }

  private obtenirLettreGrilleMotHorizontal(mot: Mot, indice: number): LettreGrille {
    return this.matriceDesMotsSurGrille[indice + mot.premierX][mot.premierY];
  }

  private envoieMatrice(): void {
    this.listeMotsService.serviceEnvoieMatriceLettres(this.matriceDesMotsSurGrille);
  }
}
