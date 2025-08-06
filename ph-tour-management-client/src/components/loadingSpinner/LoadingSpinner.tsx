//

import { Loader2 } from "lucide-react";

interface iProps {
  loading: boolean;
  defaultText: string;
  loadingText: string;
}

export default function LoadingSpinner({
  loading,
  defaultText,
  loadingText,
}: iProps) {
  return (
    <>
      {loading ? (
        <span className="flex items-center justify-center gap-x-1.5">
          <span>
            <Loader2 className="animate-spin" />
          </span>
          {loadingText}
        </span>
      ) : (
        <span>{defaultText}</span>
      )}
    </>
  );
}
