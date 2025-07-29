import { EMOJI_GROUPS } from "@/lib/emoji-groups";
import {
  Carrot,
  CircleCheck,
  Clock9,
  Flag,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Plane,
  Smile,
  ThumbsUp,
  Volleyball,
} from "lucide-react";

export const navIcons = [
  {
    title: EMOJI_GROUPS[0],
    icon: Clock9,
  },
  {
    title: EMOJI_GROUPS[1],
    icon: Smile,
  },
  {
    title: EMOJI_GROUPS[2],
    icon: ThumbsUp,
  },
  {
    title: EMOJI_GROUPS[3],
    icon: Leaf,
  },
  {
    title: EMOJI_GROUPS[4],
    icon: Carrot,
  },
  {
    title: EMOJI_GROUPS[5],
    icon: Volleyball,
  },
  {
    title: EMOJI_GROUPS[6],
    icon: Plane,
  },
  {
    title: EMOJI_GROUPS[7],
    icon: Lightbulb,
  },
  {
    title: EMOJI_GROUPS[8],
    icon: CircleCheck,
  },
  {
    title: EMOJI_GROUPS[9],
    icon: Flag,
  },
  {
    title: EMOJI_GROUPS[10],
    icon: LayoutGrid,
  },
] as const;
