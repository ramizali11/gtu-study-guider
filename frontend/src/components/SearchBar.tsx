import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  // TODO: Wire search query to FastAPI search endpoint
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative w-full max-w-md"
    >
      <label htmlFor="dashboard-search" className="sr-only">
        Search
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="dashboard-search"
        type="search"
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground shadow-card outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  );
}

export default SearchBar;
