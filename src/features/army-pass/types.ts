export const eraIds = [
  "wings",
  "map-of-the-soul",
  "persona",
  "arirang",
] as const;
/** BE remains internal for recovery; it is not a public era option. */
export type EraId = (typeof eraIds)[number] | "be";
export type PhotoSource = "artwork" | "personal" | "gallery";
export type ArtworkVariant = 0 | 1 | 2;
export type Crop = { zoom: number; x: number; y: number };
export type ImageFitMode = "cover" | "contain";
export type PersonalPhoto = { url: string; width: number; height: number };
export type EraLogo = {
  status: "pending-authorization" | "authorized";
  path: string | null;
  credit: string;
  source: string;
  rightsHolder: string;
  authorizationReference: string | null;
  usageConditions: string | null;
  placement: { x: number; y: number; width: number; height: number };
};
export type EraTheme = {
  id: EraId;
  name: string;
  caption: string;
  mood: string;
  colors: { dark: string; mid: string; accent: string; light: string };
  logo: EraLogo;
};
export type AuthorizedEraPhoto = {
  id: string;
  era: EraId;
  path: string;
  description: string;
  credit: string;
  source: string;
  authorization: { status: "authorized"; reference: string };
  fitMode: ImageFitMode;
  objectPositionX: number;
  objectPositionY: number;
  initialScale: number;
};
export type PassFields = {
  displayName: string;
  city: string;
  state: string;
  bias: string;
  favoriteSong: string;
  armySince: string;
  experience: string;
  message: string;
};
export type PassModel = {
  /** Independent optional portrait; never replaces the group photograph. */
  personalPhoto?: { url: string; crop: Crop };
  era: EraId;
  fields: PassFields;
  source: PhotoSource;
  artwork: ArtworkVariant;
  imageUrl: string | null;
  crop: Crop;
  imageFitMode?: ImageFitMode;
  imageCredit?: string;
};
