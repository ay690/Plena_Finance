import type { JSX } from "react";

const Spinner = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex items-center gap-2 text-zinc-400 p-4">
        <span
          className="inline-block h-4 w-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm flex text-center">Loading…</span>
      </div>
    </div>
  );
};

export default Spinner;

