"use client";

import { useAvailableModels } from "@/lib/hooks/use-available-models";
import { Loader2, ChevronDown } from "lucide-react";
import { DEFAULT_MODEL } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { memo, useMemo } from "react";

type ModelSelectorProps = {
  modelId: string;
  onModelChange: (modelId: string) => void;
};

export const ModelSelector = memo(function ModelSelector({
  modelId = DEFAULT_MODEL,
  onModelChange,
}: ModelSelectorProps) {
  const { models, isLoading, error } = useAvailableModels();

  // Find the selected model to display its badge and truncated name
  const selectedModel = useMemo(() => {
    return models?.find((m) => m.id === modelId);
  }, [models, modelId]);

  const getSelectedModelFamily = () => {
    if (!selectedModel) return "";
    const [family] = selectedModel.id.split("/");
    return family || "";
  };

  const groupedModels = useMemo(() => {
    const groups: Record<string, typeof models> = {};

    for (const model of models ?? []) {
      const [family] = model.id.split("/");
      const key = family || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(model);
    }

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([family, models]) => ({ family, models }));
  }, [models]);

  const getFamilyLabel = (family: string) => {
    switch (family) {
      case "openai":
        return "OpenAI (LLM)";
      case "google":
        return "Google Gemini (LLM / Diffusion)";
      case "deepseek":
        return "DeepSeek (LLM)";
      default:
        // Check if it's a Flux model
        if (family.toLowerCase().includes("flux")) {
          return "Flux (Diffusion)";
        }
        return `${family.charAt(0).toUpperCase() + family.slice(1)} (LLM)`;
    }
  };

  const getFamilyBadge = (family: string) => {
    let short: string;
    if (family === "openai") {
      short = "O";
    } else if (family === "google") {
      short = "G";
    } else if (family === "deepseek") {
      short = "DS";
    } else if (family.toLowerCase().includes("flux")) {
      short = "F";
    } else {
      short = family.charAt(0).toUpperCase();
    }

    return (
      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted text-[9px] font-semibold uppercase mr-1">
        {short}
      </span>
    );
  };

  return (
    <Select
      value={modelId}
      onValueChange={onModelChange}
      disabled={isLoading || !!error || !models?.length}
    >
      <SelectTrigger className="w-9 h-9 md:w-[160px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:outline-none focus:border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl font-medium text-sm p-0 md:px-3 [&_[data-placeholder]]:hidden md:[&_[data-placeholder]]:block [&>svg]:hidden md:[&>svg]:block overflow-hidden">
        <div className="flex items-center justify-center w-full h-full md:hidden">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        <div className="hidden md:flex items-center gap-1.5 w-full min-w-0 overflow-hidden">
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin shrink-0" />
              <span className="text-sm">Loading</span>
            </>
          ) : error ? (
            <span className="text-red-500 text-sm">Error</span>
          ) : !models?.length ? (
            <span className="text-sm">No models</span>
          ) : selectedModel ? (
            <>
              <span className="shrink-0">{getFamilyBadge(getSelectedModelFamily())}</span>
              <SelectValue placeholder="Select model" className="truncate min-w-0" />
            </>
          ) : (
            <SelectValue placeholder="Select model" className="truncate min-w-0" />
          )}
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-2xl border-0 shadow-border-medium bg-popover/95 backdrop-blur-sm animate-scale-in" align="start" sideOffset={4}>
        {groupedModels.map(({ family, models: familyModels }) => (
          <SelectGroup key={family}>
            <SelectLabel className="text-xs text-muted-foreground px-2 py-1">
              {getFamilyLabel(family)}
            </SelectLabel>
            {familyModels.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="rounded-lg transition-colors duration-150 ease-out flex items-center gap-2"
              >
                {getFamilyBadge(family)}
                <span className="truncate">{model.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
});
