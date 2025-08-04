import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

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
    <div className="h-7 flex flex-1 shrink relative overflow-visible ">
      <Search className="h-full aspect-square p-1 absolute left-0.5 -translate-y-1/2 top-1/2 pointer-events-none text-gray-500 stroke-(length:--twemoji-icon-stroke-width)" />
      <input
        className="pl-7 pr-1 text-sm h-full w-full twemoji-input"
        placeholder="Filter..."
        value={query}
        onChange={handleQueryChange}
        onKeyDown={(event) => {
          stopEnterPropagation(event);
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.stopPropagation();
          }
        }}
      />
    </div>
  );
};

export default memo(Input);
