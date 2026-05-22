import { Loader2 } from "lucide-react";

export default function WorkspaceLoadingBridge() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      <p className="text-xs font-bold tracking-wider text-stone-400 uppercase">
        Preparing Workspace...
      </p>
    </div>
  );
}
