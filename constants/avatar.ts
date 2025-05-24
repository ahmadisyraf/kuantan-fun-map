import type {
  Sex,
  EarSize,
  HairStyle,
  HairStyleMan,
  HairStyleWoman,
  HatStyle,
  EyeStyle,
  GlassesStyle,
  NoseStyle,
  MouthStyle,
  ShirtStyle,
  EyeBrowStyle,
} from "react-nice-avatar";

export const sexOptions: Sex[] = ["man", "woman"];
export const earSizeOptions: EarSize[] = ["small", "big"];
export const hairStyleOptions: HairStyle[] = [
  "normal",
  "thick",
  "mohawk",
  "womanLong",
  "womanShort",
];
export const hairStyleManOptions: HairStyleMan[] = [
  "normal",
  "thick",
  "mohawk",
];
export const hairStyleWomanOptions: HairStyleWoman[] = [
  "normal",
  "womanLong",
  "womanShort",
];
export const hatStyleOptions: HatStyle[] = ["beanie", "turban", "none"];
export const eyeStyleOptions: EyeStyle[] = ["circle", "oval", "smile"];
export const glassesStyleOptions: GlassesStyle[] = ["round", "square", "none"];
export const noseStyleOptions: NoseStyle[] = ["short", "long", "round"];
export const mouthStyleOptions: MouthStyle[] = ["laugh", "smile", "peace"];
export const shirtStyleOptions: ShirtStyle[] = ["hoody", "short", "polo"];
export const eyeBrowStyleOptions: EyeBrowStyle[] = ["up", "upWoman"];
