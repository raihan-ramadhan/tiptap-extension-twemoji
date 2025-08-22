import { EMOJI_GROUPS, EMOJI_GROUPS_PROPS, getGroup } from "@/lib/emoji-groups";
import { ARRAY2D_ITEM_PROPS, CustomEmoji, SuggestionItems } from "@/types";
import { Emoji } from "@/data/emoji-sprite-map";

// basicaly this function is to tranfrom from [Emoji, Emoji, ...rest] to
// 2d array like [[Emoji,Emoji, ...10 more],[Emoji, ...11 more],] (12 items in array)
// and there is a group name between different group of emoji that we use mockup emoji to have same structure with rest emojis in data because they are in same array

export const transformData = ({
  COLUMNS,
  recent,
  filteredEmojis,
  minCellsToHideNav,
  filteredCustomEmojis,
  disabledAddCustomEmoji,
}: {
  COLUMNS: number;
  recent: SuggestionItems["recent"];
  filteredEmojis: Emoji[];
  minCellsToHideNav: number;
  filteredCustomEmojis: CustomEmoji[] | undefined;
  disabledAddCustomEmoji: boolean;
}) => {
  const new2dArr: ARRAY2D_ITEM_PROPS[] = [];
  const titleEmojiMockup = (
    groupTitle: EMOJI_GROUPS_PROPS
  ): { groupTitle: string } => ({
    groupTitle,
  });

  const groupsIndexes: Record<EMOJI_GROUPS_PROPS, number | undefined> = {
    Recent: undefined,
    "Smileys & Emotion": undefined,
    "People & Body": undefined,
    "Animals & Nature": undefined,
    "Food & Drink": undefined,
    "Travel & Places": undefined,
    Activities: undefined,
    Objects: undefined,
    Symbols: undefined,
    Flags: undefined,
    Custom: undefined,
    All: undefined,
  };

  let tempGroup;
  let tempArr: ARRAY2D_ITEM_PROPS = [];

  let temp2dArrRecent: ARRAY2D_ITEM_PROPS[] = [];

  if (recent) {
    new2dArr.push([titleEmojiMockup(EMOJI_GROUPS[0])]);
    groupsIndexes.Recent = 0;

    for (let i = 0; i < recent.length; i++) {
      tempArr.push(recent[i]);
      if (tempArr.length === COLUMNS || i === recent.length - 1) {
        temp2dArrRecent.push(tempArr);
        tempArr = [];
      }
    }
  }

  const itemsSuggestion =
    filteredEmojis.length + (filteredCustomEmojis?.length ?? 0);

  if (itemsSuggestion > 0 && itemsSuggestion <= minCellsToHideNav) {
    new2dArr.push(...temp2dArrRecent);

    new2dArr.push([titleEmojiMockup(EMOJI_GROUPS[11])]);

    for (let i = 0; i < filteredEmojis.length; i++) {
      if (
        typeof filteredEmojis[i].group !== "undefined" &&
        typeof filteredEmojis[i].group === "number" &&
        filteredEmojis[i].group !== 2 // why 2? it's because group with index 2 refer to component emoji, we not use that
      ) {
        tempArr.push(filteredEmojis[i]);
        if (tempArr.length === COLUMNS) {
          new2dArr.push(tempArr);
          tempArr = [];
        }
      }
    }

    if (filteredCustomEmojis && filteredCustomEmojis.length > 0) {
      for (let i = 0; i < filteredCustomEmojis.length; i++) {
        tempArr.push(filteredCustomEmojis[i]);
        if (tempArr.length === COLUMNS) {
          new2dArr.push(tempArr);
          tempArr = [];
        }
      }
    }

    // ACTION BUTTON
     if (!disabledAddCustomEmoji) tempArr.push({ buttonLabel: "Add Emoji" });

    if (tempArr.length > 0) new2dArr.push(tempArr);
  } else if (itemsSuggestion > 0) {
    new2dArr.push(...temp2dArrRecent);

    for (let i = 0; i < filteredEmojis.length; i++) {
      if (
        typeof filteredEmojis[i].group !== "undefined" &&
        typeof filteredEmojis[i].group === "number" &&
        filteredEmojis[i].group !== 2 // why 2? it's because group with index 2 refer to component emoji, we not use that
      ) {
        // check if current group name is same or not with emoji's group name this check if we mapping new group of emoji

        if (tempGroup !== filteredEmojis[i].group) {
          // if we enter new emoji therun this block
          if (tempArr.length > 0) {
            // if tempArr is not empty then push it
            new2dArr.push(tempArr);
            // reset
            tempArr = [];
          }
          // give new name
          tempGroup = filteredEmojis[i].group;
          // push index track for nav
          groupsIndexes[
            getGroup(filteredEmojis[i].group as number) as EMOJI_GROUPS_PROPS
          ] = new2dArr.length;

          // push Group name to main array
          const newGroupName = getGroup(filteredEmojis[i].group as number);
          if (newGroupName) {
            new2dArr.push([titleEmojiMockup(newGroupName)]);
          }
        }

        tempArr.push(filteredEmojis[i]);
        if (tempArr.length === COLUMNS || i === filteredEmojis.length - 1) {
          new2dArr.push(tempArr);
          tempArr = [];
        }
      }
    }

    new2dArr.push([titleEmojiMockup(EMOJI_GROUPS[10])]);
    groupsIndexes.Custom = new2dArr.length;

    // ACTION BUTTON
    if (!disabledAddCustomEmoji)
      tempArr.push({ buttonLabel: "Add Emoji", align: "start" });

    if (filteredCustomEmojis && filteredCustomEmojis.length > 0) {
      for (let i = 0; i < filteredCustomEmojis.length; i++) {
        tempArr.push(filteredCustomEmojis[i]);
        if (
          tempArr.length === COLUMNS ||
          i === filteredCustomEmojis.length - 1
        ) {
          new2dArr.push(tempArr);
          tempArr = [];
        }
      }
    }

    if (tempArr.length > 0) new2dArr.push(tempArr);
  } else {
    if (recent) {
      if (temp2dArrRecent[temp2dArrRecent.length - 1].length % COLUMNS) {
        // ACTION BUTTON
        if (!disabledAddCustomEmoji)
          temp2dArrRecent[temp2dArrRecent.length - 1].push({
            buttonLabel: "Add Emoji",
          });
      } else {
        // ACTION BUTTON
        if (!disabledAddCustomEmoji)
          temp2dArrRecent.push([{ buttonLabel: "Add Emoji" }]);
      }

      new2dArr.push(...temp2dArrRecent);
    }
  }

  return { arr2d: new2dArr, groupsIndexes };
};
