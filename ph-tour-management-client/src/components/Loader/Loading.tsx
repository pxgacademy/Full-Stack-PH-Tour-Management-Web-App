import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="grid place-content-center flex-12">
      <Loader2 size={64} className="animate-spin text-foreground" />
    </div>
  );
};

export default Loading;
