import portraits from "../../../public/images/jogos/integrantes/credits.json";
export const memberPortraits = portraits;
export type MemberPortraitRecord = (typeof portraits)[number];
export function getMemberPortraitSrc(photo: MemberPortraitRecord) {
  return `${photo.src}?v=${photo.sha256.slice(0, 12)}`;
}
export function getMemberPortrait(id: string) {
  return memberPortraits.find((photo) => photo.id === id);
}
