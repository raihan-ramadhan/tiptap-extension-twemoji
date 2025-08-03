import React, { memo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { Trash } from "lucide-react";
import { ComponentEmojiMentionProps } from "@/types";

const RemoveButton = ({
  onCancel,
  callback,
  stopEnterPropagation,
  closeAfterDelete = true,
}: {
  stopEnterPropagation: (event: React.KeyboardEvent<HTMLElement>) => void;
  callback?: () => void;
  onCancel?: ComponentEmojiMentionProps["onCancel"];
  closeAfterDelete?: boolean;
}) => {
  const handleRemoveClick = useCallback(() => {
    callback?.();
    if (closeAfterDelete) onCancel?.();
  }, [callback, onCancel]);

  return (
    <Tooltip delay={200}>
      <TooltipTrigger
        className="aspect-square size-7 flex justify-center items-center outline-1 outline-(--border-color) rounded-[8px] p-1.5 focus-visible:outline-2 focus-visible:outline-(--focus-active-color) focus-visible:-outline-offset-[2px]"
        onClick={handleRemoveClick}
        onKeyDown={stopEnterPropagation}
      >
        <Trash strokeWidth="1.5" />
      </TooltipTrigger>
      <TooltipContent>
        <span>Remove</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(RemoveButton);
