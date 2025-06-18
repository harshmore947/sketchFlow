"use server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createNoet(data: {
  title: string;
  content: {
    elements: any[];
    appState: any;
  };
}) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not Authenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const newNote = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, newNote };
  } catch (error) {
    console.error("Error creating note", error);
    return { success: false, error: "failed to create note" };
  }
}

export async function getNotes() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { success: true, notes };
  } catch (error) {
    console.error("error fetching notes", error);
    return { success: false, error: "failed to fetch notes" };
  }
}

export async function getNote(id: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const note = await prisma.note.findUnique({
      where: {
        userId: user.id,
        id: id,
      },
    });

    return { success: "Not fetched successfully", note };
  } catch (error) {
    console.error("Error in fetcing the single note", error);
    return { success: false, error: "failed to fetch notes" };
  }
}

export async function updateNote(
  id: string,
  data: {
    title?: string;
    content?: {
      elements: any[];
      appState: any;
    };
    isArchived: boolean;
  }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not Authenticated");
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    const note = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(typeof data.isArchived === "boolean" && {
          isArchived: data.isArchived,
        }),
      },
    });
    revalidatePath("/dashboard");
    return { success: true, note };
  } catch (error) {
    console.log("Error Updating note:", error);
    return { success: false, error: "failed to update the note" };
  }
}

export async function deleteNote(id: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not Authenticated");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error("no user");
    }

    await prisma.note.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {}
}

export async function archiveNote(id: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const note = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isArchived: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, note };
  } catch (error) {
    console.error("Error archiving note:", error);
    return { success: false, error: "Failed to archive note" };
  }
}

export async function getArchivedNotes() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        isArchived: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { success: true, notes };
  } catch (error) {
    console.error("Error fetching archived notes:", error);
    return { success: false, error: "Failed to fetch archived notes" };
  }
}

// Restore an archived note
export async function restoreNote(id: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const note = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isArchived: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, note };
  } catch (error) {
    console.error("Error restoring note:", error);
    return { success: false, error: "Failed to restore note" };
  }
}

//search notes
export async function searchNotes(query: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        isArchived: false,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              path: ["elements"],
              array_contains: [{ text: query }],
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { success: true, notes };
  } catch (error) {
    console.error("Error Searching notes", error);
    return { sucess: false, error: "failed to search notes" };
  }
}

// Toggle star/favorite status of a note
export async function toggleStarNote(id: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // First get the current note to check its star status
    const currentNote = await prisma.note.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!currentNote) {
      throw new Error("Note not found");
    }

    // Toggle the star status
    const note = await prisma.note.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isStarted: !currentNote.isStarted, // Toggle the star status
      },
    });

    revalidatePath("/dashboard");
    return { success: true, note };
  } catch (error) {
    console.error("Error toggling star note:", error);
    return { success: false, error: "Failed to toggle star note" };
  }
}

// Get starred notes
export async function getStarredNotes() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        isStarted: true,
        isArchived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { success: true, notes };
  } catch (error) {
    console.error("Error fetching starred notes:", error);
    return { success: false, error: "Failed to fetch starred notes" };
  }
}
