"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Save,
  Maximize,
  Minimize,
  Loader2,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { getNote, updateNote } from "@/action/notes";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

// Dynamically import Excalidraw with SSR disabled
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

function WorkspacePage() {
  const params = useParams();
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [note, setNote] = useState<any>(null);

  //fetch note data when component mounts
  useEffect(() => {
    const fetchNote = async () => {
      if (!params.id) return;

      try {
        const result = await getNote(params.id as string);
        if (result.success && result.note) {
          setNote(result.note);
        }
      } catch (error) {
        console.error("error fetching note:", error);
        // Show error message
        alert("Failed to load note");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [params.id]);

  //load note content into excalidraw when api is ready
  useEffect(() => {
    if (excalidrawAPI && note) {
      try {
        const content = note.content;
        if (content && (content.elements || content.appState)) {
          // Remove collaborators from appState to avoid forEach error
          const { collaborators, ...appStateWithoutCollaborators } =
            content.appState || {};

          excalidrawAPI.updateScene({
            elements: content.elements || [],
            appState: appStateWithoutCollaborators,
          });
        }
      } catch (error) {
        console.error("Error loading note content", error);
      }
    }
  }, [excalidrawAPI, note]);

  const handleExport = async () => {
    if (!excalidrawAPI) {
      alert("Canvas not ready");
      return;
    }

    setIsExporting(true);
    try {
      // Get the current scene data
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      // Create a blob with the scene data
      const sceneData = {
        type: "excalidraw",
        version: 2,
        source: "excalidraw-draw",
        elements: Array.from(elements),
        appState,
        files,
      };

      const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
        type: "application/json",
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${note?.title || "drawing"}.excalidraw`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Drawing exported successfully");
    } catch (error) {
      console.error("Error exporting drawing:", error);
      alert("Failed to export drawing");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    if (!excalidrawAPI || !params.id) {
      alert("Canvas not ready");
      return;
    }

    setIsSaving(true);
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();

      const result = await updateNote(params.id as string, {
        content: {
          elements: Array.from(elements),
          appState,
        },
        isArchived: false,
      });

      if (result.success) {
        alert("Note saved successfully");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        alert("Failed to save note");
      }
    } catch (error) {
      console.error("error saving note:", error);
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    // Implement share logic
    alert("Share functionality coming soon!");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 px-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-6" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={handleSave}
            className={saveSuccess ? "text-green-400" : ""}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saveSuccess ? "Saved!" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-hidden px-6 py-4">
        <div className="h-full w-full rounded-lg overflow-hidden border border-white/10">
          <Excalidraw
            excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
              setExcalidrawAPI(api)
            }
            theme="dark"
            viewModeEnabled={false}
            zenModeEnabled={true}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: { saveFileToDisk: true },
                saveAsImage: true,
              },
            }}
            initialData={{
              appState: {
                currentItemFontFamily: 1,
                theme: "dark",
              },
              elements: [],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;
