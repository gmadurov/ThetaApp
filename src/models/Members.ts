import { SuccessResponse } from "./Responses";

export interface MemberRespose extends SuccessResponse {
  results: Member[];
}

export interface Member {
  id: number;
  voorletters: string;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  foto: null | string;
  geboortedatum: Date;
  overlijdensdatum: null;
  geslacht: Geslacht;
  allergieen: string[];
  adres: string;
  postcode: string;
  woonplaats: string;
  land: Land;
  telefoonnummer: string;
  emailadres: string;
  inauguratiedatum: Date;
  einddatum: null;
  lidstatus: Lidstatus;
  ser_donateur: boolean;
  opleiding: string[];
  begin_studie: Date | null;
  einde_studie: Date | null;
  iban: string;
  bic: string;
  rekeninghouder: string;
  werkgever: string;
  functie: string;
  gegevens_zichtbaar: boolean;
  ploeglidmaatschappen: Ploeglidmaatschappen[];
  commissielidmaatschappen: Commissielidmaatschappen[];
  bestuurslidmaatschappen: Bestuurslidmaatschappen[];
}

export interface Bestuurslidmaatschappen {
  bestuur: Bestuur;
  functie: string;
  emailadres: string;
  ancienniteit: number;
  senator: boolean;
}

export interface Bestuur {
  id: number;
  verenigingsjaar: number;
  emailadres: string;
  naam: string;
  installatiedatum: Date;
  dechargedatum: Date;
  foto: string;
  verhaal: string;
}

export interface Commissielidmaatschappen {
  commissie: Commissie;
  functie: string;
  begindatum: Date;
  einddatum: Date | null;
}

export interface Commissie {
  id: number;
  categorie: Categorie;
  emailadres: string;
  naam: string;
  afkorting: string;
  beschrijving: string;
  foto: null | string;
}

export enum Categorie {
  Continu = "CONTINU",
  Kalenderjaar = "KALENDERJAAR",
  Verenigingsjaar = "VERENIGINGSJAAR",
}

export enum Geslacht {
  M = "M",
  V = "V",
}

export enum Land {
  Nl = "NL",
}

export enum Lidstatus {
  Lid = "Lid",
  Aspirant = "Aspirant",
}

export interface Ploeglidmaatschappen {
  ploeg: Ploeg;
  functie: PloeglidmaatschappenFunctie;
}

export enum PloeglidmaatschappenFunctie {
  C = "C",
  R = "R",
  S = "S",
}

export interface Ploeg {
  id: number;
  naam: string;
  seizoen: number;
  emailadres: string;
  sectie: Sectie;
  geslacht: PloegGeslacht;
  niveau: Niveau;
  foto: null | string;
  verhaal: string;
}

export enum PloegGeslacht {
  Dames = "DAMES",
  Empty = "",
  Heren = "HEREN",
  Mixed = "MIXED",
}

export enum Niveau {
  Club = "CLUB",
  Compo = "COMPO",
  Ej = "EJ",
  Mg = "MG",
  Oj = "OJ",
}

export enum Sectie {
  Competitie = "COMPETITIE",
  Wedstrijd = "WEDSTRIJD",
}
