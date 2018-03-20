import { Group, Mesh, CircleGeometry, PlaneGeometry, Vector3, Texture,
         RepeatWrapping, MeshPhongMaterial, TextureLoader, BackSide } from "three";
import { Droite } from "./droite";
import { Point } from "./Point";
import { PI_OVER_2 } from "../../constants";

export const LARGEUR_PISTE: number = 10;
const NOMBRE_SEGMENTS: number = 25;
const DROITE_REFERENCE: Droite = new Droite(new Point(0, 0), new Point(0, 1));

// Texture
const CHEMIN: string = "./../../../../assets/skybox/textures/";
const NOM_TEXTURE: string = "roche1";
const FORMAT: string = ".jpg";
const URL_TEXTURE: string = CHEMIN + NOM_TEXTURE + FORMAT;
export const TAILLE_REPETITION: number = 1;

export class SegmentPiste extends Group {

    private readonly droite: Droite;

    public constructor(point1: Point, point2: Point) {
        super();
        this.droite = new Droite(point1, point2);
        this.position.set(point1.x, 0, point1.y);
        this.ajouterCercle();
        this.ajouterSegment();
    }

    private ajouterCercle(): void {
        const texture: Texture = this.texture;
        texture.repeat.set(LARGEUR_PISTE, LARGEUR_PISTE);

        const DEUX: number = 2;
        const cercle: Mesh = new Mesh(new CircleGeometry(LARGEUR_PISTE / DEUX, NOMBRE_SEGMENTS), this.materielCercle);
        cercle.rotateX(PI_OVER_2);
        cercle.receiveShadow = true;
        this.add(cercle);
    }

    private ajouterSegment(): void {
        this.add(new Mesh(this.geometrieSegment, this.materielSegment));
    }

    private get materielSegment(): MeshPhongMaterial {
        const texture: Texture = this.texture;
        texture.repeat.set(LARGEUR_PISTE, this.longueur);

        return new MeshPhongMaterial( {side: BackSide, map: texture, depthWrite: false});
    }

    private get materielCercle(): MeshPhongMaterial {
        const texture: Texture = this.texture;
        texture.repeat.set(LARGEUR_PISTE, LARGEUR_PISTE);

        return new MeshPhongMaterial( {side: BackSide, map: texture, depthWrite: false});
    }

    private get texture(): Texture {
        const texture: Texture = new TextureLoader().load(URL_TEXTURE);
        texture.wrapS = texture.wrapT = RepeatWrapping;

        return texture;
    }

    private get geometrieSegment(): PlaneGeometry {
        const geometrie: PlaneGeometry = new PlaneGeometry(LARGEUR_PISTE, this.droite.distance());
        geometrie.rotateX(PI_OVER_2);
        geometrie.rotateY(this.angle);
        geometrie.translate(this.deplacementSegment.x, this.deplacementSegment.y, this.deplacementSegment.z);

        return geometrie;
    }

    private get centre(): Vector3 {
        return this.droite.getCenter();
    }

    private get deplacementSegment(): Vector3 {
        return this.centre.sub(this.droite.start);
    }

    private get angle(): number {
        return this.droite.direction.cross(DROITE_REFERENCE.direction).y < 0
            ? this.droite.angleAvecDroite(DROITE_REFERENCE)
            : Math.PI - this.droite.angleAvecDroite(DROITE_REFERENCE);
    }

    private get longueur(): number {
        return this.droite.direction.length();
    }
}
