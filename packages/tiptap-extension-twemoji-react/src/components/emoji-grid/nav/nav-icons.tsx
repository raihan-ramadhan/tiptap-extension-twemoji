import * as React from "react";
import { cn } from "@/lib/utils";
import { EMOJI_GROUPS } from "@/lib/emoji-groups";

const RecentIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 7.5 12" />
      </svg>
    );
  }
);
RecentIcon.displayName = "RecentIcon";

const SmileysEmotionIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    );
  }
);
SmileysEmotionIcon.displayName = "SmileysEmotionIcon";

const PeopleBodyIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    );
  }
);
PeopleBodyIcon.displayName = "PeopleBodyIcon";

const AnimalsNatureIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    );
  }
);
AnimalsNatureIcon.displayName = "AnimalsNatureIcon";

const FoodDrinkIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46" />
        <path d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" />
        <path d="M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z" />
      </svg>
    );
  }
);
FoodDrinkIcon.displayName = "FoodDrinkIcon";

const ActivitiesIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
        <path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
        <path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
        <path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
        <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }
);
ActivitiesIcon.displayName = "ActivitiesIcon";

const TravelAndPlacesIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    );
  }
);
TravelAndPlacesIcon.displayName = "TravelAndPlacesIcon";

const ObjectsIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    );
  }
);
ObjectsIcon.displayName = "ObjectsIcon";

const SymbolIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
);
SymbolIcon.displayName = "SymbolIcon";

const FlagsIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      </svg>
    );
  }
);
FlagsIcon.displayName = "FlagsIcon";

const CustomIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-full", className)}
        {...props}
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    );
  }
);
CustomIcon.displayName = "CustomIcon";

export const AddEmojiIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn("size-full", className)}
        {...props}
      >
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"></path>
      </svg>
    );
  }
);
AddEmojiIcon.displayName = "AddEmojiIcon";

export const navIcons = [
  {
    title: EMOJI_GROUPS[0],
    icon: RecentIcon,
  },
  {
    title: EMOJI_GROUPS[1],
    icon: SmileysEmotionIcon,
  },
  {
    title: EMOJI_GROUPS[2],
    icon: PeopleBodyIcon,
  },
  {
    title: EMOJI_GROUPS[3],
    icon: AnimalsNatureIcon,
  },
  {
    title: EMOJI_GROUPS[4],
    icon: FoodDrinkIcon,
  },
  {
    title: EMOJI_GROUPS[5],
    icon: TravelAndPlacesIcon,
  },
  {
    title: EMOJI_GROUPS[6],
    icon: ActivitiesIcon,
  },
  {
    title: EMOJI_GROUPS[7],
    icon: ObjectsIcon,
  },
  {
    title: EMOJI_GROUPS[8],
    icon: SymbolIcon,
  },
  {
    title: EMOJI_GROUPS[9],
    icon: FlagsIcon,
  },
  {
    title: EMOJI_GROUPS[10],
    icon: CustomIcon,
  },
] as const;
