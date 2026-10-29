import { eraPhotoManifest, photosForEra } from "./themes";
import type { Crop, EraId, PassFields, PersonalPhoto } from "./types";
import type { AuthorizedEraPhoto } from "./types";

export const defaultCrop: Crop = { zoom: 1, x: 50, y: 50 };
export const initialFields: PassFields = {
  displayName: "",
  city: "",
  state: "",
  bias: "OT7",
  favoriteSong: "",
  armySince: "",
  experience: "Prefiro não informar",
  message: "",
};
export type BuilderState = {
  step: number;
  era: EraId;
  fields: PassFields;
  photo: PersonalPhoto | null;
  galleryId: string | null;
  gallerySelectionByEra: Partial<Record<EraId, string>>;
};
export function createInitialBuilderState(
  manifest: readonly AuthorizedEraPhoto[] = eraPhotoManifest,
): BuilderState {
  const firstPhoto = photosForEra("wings", manifest)[0];
  return {
    step: 1,
    era: "wings",
    fields: initialFields,
    photo: null,
    galleryId: firstPhoto?.id ?? null,
    gallerySelectionByEra: firstPhoto ? { wings: firstPhoto.id } : {},
  };
}
export const initialBuilderState = createInitialBuilderState();
export type BuilderAction =
  | { type: "step"; step: number }
  | { type: "era"; era: EraId }
  | { type: "fields"; fields: PassFields }
  | { type: "photo"; photo: PersonalPhoto | null }
  | { type: "gallery"; id: string };

export function builderReducer(
  state: BuilderState,
  action: BuilderAction,
): BuilderState;
export function builderReducer(
  state: BuilderState,
  action: BuilderAction,
  manifest: readonly AuthorizedEraPhoto[],
): BuilderState;
export function builderReducer(
  state: BuilderState,
  action: BuilderAction,
  manifest: readonly AuthorizedEraPhoto[] = eraPhotoManifest,
): BuilderState {
  switch (action.type) {
    case "step":
      return { ...state, step: Math.min(4, Math.max(1, action.step)) };
    case "era": {
      const selections = { ...state.gallerySelectionByEra };
      const currentPhoto = photosForEra(state.era, manifest).find(
        (photo) => photo.id === state.galleryId,
      );
      if (currentPhoto) selections[state.era] = currentPhoto.id;
      const photos = photosForEra(action.era, manifest);
      const selectedPhoto =
        photos.find((photo) => photo.id === selections[action.era]) ??
        photos[0];
      if (selectedPhoto) selections[action.era] = selectedPhoto.id;
      else {
        delete selections[action.era];
      }
      return {
        ...state,
        era: action.era,
        galleryId: selectedPhoto?.id ?? null,
        gallerySelectionByEra: selections,
      };
    }
    case "fields":
      return { ...state, fields: action.fields };
    case "photo":
      return {
        ...state,
        photo: action.photo,
      };
    case "gallery": {
      const photo = photosForEra(state.era, manifest).find(
        (candidate) => candidate.id === action.id,
      );
      if (!photo) return state;
      return {
        ...state,
        galleryId: photo.id,
        gallerySelectionByEra: {
          ...state.gallerySelectionByEra,
          [state.era]: photo.id,
        },
      };
    }
  }
}
