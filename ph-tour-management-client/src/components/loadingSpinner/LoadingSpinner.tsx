//

import { Loader2 } from "lucide-react";

interface iProps {
  isLoading: boolean;
  defaultText: string;
  loadingText: string;
}

export default function LoadingSpinner({
  isLoading,
  defaultText,
  loadingText,
}: iProps) {
  return (
    <>
      {isLoading ? (
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
