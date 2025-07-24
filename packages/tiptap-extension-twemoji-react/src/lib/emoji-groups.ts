export const EMOJI_GROUPS = [
  "Recent",
  "Smileys & Emotion",
  "People & Body",
  "Animals & Nature",
  "Food & Drink",
  "Travel & Places",
  "Activities",
  "Objects",
  "Symbols",
  "Flags",
  "Custom",
  "All",
] as const;

export type EMOJI_GROUPS_PROPS = (typeof EMOJI_GROUPS)[number];

export const getGroup = (index: number): EMOJI_GROUPS_PROPS | undefined => {
  switch (index) {
    case 0:
      return EMOJI_GROUPS[1];
    case 1:
      return EMOJI_GROUPS[2];
    case 3:
      return EMOJI_GROUPS[3];
    case 4:
      return EMOJI_GROUPS[4];
    case 5:
      return EMOJI_GROUPS[5];
    case 6:
      return EMOJI_GROUPS[6];
    case 7:
      return EMOJI_GROUPS[7];
    case 8:
      return EMOJI_GROUPS[8];
    case 9:
      return EMOJI_GROUPS[9];
    case 11:
      return EMOJI_GROUPS[11];
  }
  return;
};
