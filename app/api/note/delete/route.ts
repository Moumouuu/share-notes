import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  const session = await getServerSession(authOptions);
  const { noteId } = await req.json();

  if (!session || !noteId) {
    return new Error("No session or noteId");
  }

  if (!session?.user?.email) {
    return new Error("No session user email");
  }

  const user = await prismadb.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return new Error("User not found");
  }

  const note = await prismadb.note.findUnique({
    where: {
      id: noteId?.toString(),
    },
  });

  if (!note) {
    return new Error("Note not found");
  }

  await prismadb.note.delete({
    where: {
      id: noteId,
    },
  });

  return NextResponse.json({
    success: true,
    code: 200,
  });
}
