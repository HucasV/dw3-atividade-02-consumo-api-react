import { NextResponse } from "next/server";
import {
  getCharacters,
  ensureStarRailReady
} from "@/lib/starrail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Garante que os dados estejam atualizados antes da leitura.
    await ensureStarRailReady();

    const characters = getCharacters();

    return NextResponse.json({
      total: characters.length,
      characters
    });
  } catch (error) {
    console.error("Erro ao carregar personagens:", error);

    return NextResponse.json(
      {
        error: "Não foi possível carregar o catálogo de personagens.",
        details: error.message
      },
      { status: 500 }
    );
  }
}