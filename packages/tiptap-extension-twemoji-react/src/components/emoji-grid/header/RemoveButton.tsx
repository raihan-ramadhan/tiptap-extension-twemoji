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
  closeAfterDelete,
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
        className="twemoji-button twemoji-border twemoji-header__button"
        onClick={handleRemoveClick}
        onKeyDown={stopEnterPropagation}
      >
        <Trash className="twemoji-icon" />
      </TooltipTrigger>
      <TooltipContent>
        <span>Remove</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(RemoveButton);
