import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { cn } from "@/lib/utils";

const Input = ({
  query,
  setQuery,
  stopEnterPropagation,
}: {
  query?: string;
  setQuery?: Dispatch<SetStateAction<string>>;
  stopEnterPropagation: (event: React.KeyboardEvent<HTMLElement>) => void;
}) => {
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery?.(e.target.value);
    },
    [setQuery]
  );

  return (
    <input
      className={cn(
        "flex-1 grow flex bg-white/10 focus-within:ring-blue-600 focus-within:ring focus:outline-none"
      )}
      value={query}
      onChange={handleQueryChange}
      onKeyDown={stopEnterPropagation}
    />
  );
};

export default memo(Input);
