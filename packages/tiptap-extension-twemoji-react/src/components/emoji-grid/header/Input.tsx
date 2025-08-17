import { Dispatch, memo, SetStateAction, useCallback } from "react";
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
    <div className="twemoji-header__search">
      <Search className="twemoji-header__icon" />
      <input
        className="twemoji-header__input twemoji-input"
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
