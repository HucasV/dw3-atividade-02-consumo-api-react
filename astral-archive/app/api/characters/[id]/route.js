import { NextResponse } from "next/server";
import { getCharacterById } from "@/lib/starrail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const character = getCharacterById(params.id);

    if (!character) {
      return NextResponse.json(
        { error: "Personagem não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Erro ao carregar personagem:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os detalhes do personagem." },
      { status: 500 }
    );
  }
}
