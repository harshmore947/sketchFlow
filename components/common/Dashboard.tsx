"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Grid,
  List,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import {
  createNoet,
  getNotes,
  deleteNote,
  archiveNote,
  restoreNote,
  toggleStarNote,
  searchNotes,
  getArchivedNotes,
  getStarredNotes,
} from "@/action/notes";

function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterMode, setFilterMode] = useState<"all" | "starred" | "archived">(
    "all"
  );
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, [filterMode]);

  const loadNotes = async () => {
    setIsLoading(true);

    try {
      let result: any;

      switch (filterMode) {
        case "starred":
          result = await getStarredNotes();
          break;
        case "archived":
          result = await getArchivedNotes();
          break;
        default:
          result = await getNotes();
          break;
      }

      if (result && result.success && result.notes) {
        setNotes(result.notes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
    setIsLoading(false);
  };

  const handleCreateNote = async () => {
    const result = await createNoet({
      title: "Untitled",
      content: {
        elements: [],
        appState: {},
      },
    });
    if (result.success) {
      router.push(`/workspace/${result.newNote?.id}`);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const result = await searchNotes(query);
      if (result.success && result.notes) {
        setNotes(result.notes);
      }
    } else {
      loadNotes();
    }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      setActionLoading(noteId);
      const result = await deleteNote(noteId);
      if (result && result.success) {
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        alert("Failed to delete note");
      }
      setActionLoading(null);
    }
  };

  const handleArchiveNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(noteId);
    const result = await archiveNote(noteId);
    if (result.success) {
      if (filterMode === "all") {
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        loadNotes();
      }
    } else {
      alert("Failed to archive note");
    }
    setActionLoading(null);
  };

  const handleRestoreNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(noteId);
    const result = await restoreNote(noteId);
    if (result.success) {
      if (filterMode === "archived") {
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        loadNotes();
      }
    } else {
      alert("Failed to restore note");
    }
    setActionLoading(null);
  };

  const handleToggleStar = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(noteId);
    const result = await toggleStarNote(noteId);
    if (result.success) {
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, isStarted: !note.isStarted } : note
        )
      );
    } else {
      alert("Failed to toggle star");
    }
    setActionLoading(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotePreview = (content: any) => {
    if (!content || !content.elements) return "No content";

    const textElements = content.elements.filter(
      (el: any) => el.type === "text"
    );
    if (textElements.length > 0) {
      return (
        textElements[0].text?.substring(0, 50) +
        (textElements[0].text?.length > 50 ? "..." : "")
      );
    }

    const elementCount = content.elements.length;
    if (elementCount === 0) return "Empty drawing";
    return `${elementCount} element${elementCount !== 1 ? "s" : ""}`;
  };

  return (
    <div className="flex-1 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">
            {filterMode === "starred"
              ? "Starred Notes"
              : filterMode === "archived"
              ? "Archived Notes"
              : "My Notes"}
          </h1>
          <p className="text-gray-400">
            {filterMode === "starred"
              ? "Your favorite drawings"
              : filterMode === "archived"
              ? "Archived drawings"
              : "Create and manage your drawings"}
          </p>
        </div>
        <div className="flex gap-2">
          {filterMode === "archived" && (
            <Button
              variant="outline"
              className="text-white border-white/20"
              onClick={() => setFilterMode("all")}
            >
              Back to Notes
            </Button>
          )}
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleCreateNote}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filterMode === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterMode("all")}
          className={
            filterMode === "all"
              ? "bg-blue-500 hover:bg-blue-600"
              : "text-white border-white/20"
          }
        >
          All Notes
        </Button>
        <Button
          variant={filterMode === "starred" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterMode("starred")}
          className={
            filterMode === "starred"
              ? "bg-blue-500 hover:bg-blue-600"
              : "text-white border-white/20"
          }
        >
          <Star className="mr-2 h-4 w-4" />
          Starred
        </Button>
        <Button
          variant={filterMode === "archived" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterMode("archived")}
          className={
            filterMode === "archived"
              ? "bg-blue-500 hover:bg-blue-600"
              : "text-white border-white/20"
          }
        >
          <Archive className="mr-2 h-4 w-4" />
          Archived
        </Button>
      </div>

      {/* Search and View Section */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="text-white border-white/20"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid View</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="text-white border-white/20"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>List View</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && notes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            {filterMode === "starred"
              ? "No starred notes"
              : filterMode === "archived"
              ? "No archived notes"
              : "No notes yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {filterMode === "starred"
              ? "Star your favorite notes to see them here"
              : filterMode === "archived"
              ? "Archived notes will appear here"
              : "Create your first note to get started"}
          </p>
          {filterMode === "all" && (
            <Button
              onClick={handleCreateNote}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
        </div>
      )}

      {/* Notes Grid/List */}
      {!isLoading && notes.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer relative group ${
                viewMode === "list" ? "flex items-center" : ""
              }`}
              onClick={() => router.push(`/workspace/${note.id}`)}
              onMouseEnter={() => setHoveredNote(note.id)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              {/* Action Buttons - Show on Hover */}
              {hoveredNote === note.id && (
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                          onClick={(e) => handleToggleStar(note.id, e)}
                          disabled={actionLoading === note.id}
                        >
                          {actionLoading === note.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Star
                              className={`h-4 w-4 ${
                                note.isStarted
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }`}
                            />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {note.isStarted ? "Unstar" : "Star"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                          onClick={(e) =>
                            filterMode === "archived"
                              ? handleRestoreNote(note.id, e)
                              : handleArchiveNote(note.id, e)
                          }
                          disabled={actionLoading === note.id}
                        >
                          {actionLoading === note.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : filterMode === "archived" ? (
                            <Archive className="h-4 w-4" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {filterMode === "archived" ? "Restore" : "Archive"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem
                        className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                        onClick={(e) => handleDeleteNote(note.id, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Star Badge */}
              {note.isStarted && (
                <div className="absolute top-2 left-2 z-10">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              )}

              <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white truncate">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {getNotePreview(note.content)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent
                className={viewMode === "list" ? "flex-shrink-0" : ""}
              >
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
