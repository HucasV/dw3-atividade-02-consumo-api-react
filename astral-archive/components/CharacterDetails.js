"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CharacterDetails({ id }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCharacter() {
      try {
        const response = await fetch(`/api/characters/${id}`);
        if (response.status === 404) throw new Error("Esse personagem não foi encontrado no arquivo.");
        if (!response.ok) throw new Error("Não foi possível consultar os dados do personagem.");
        const data = await response.json();
        if (active) setCharacter(data);
      } catch (err) {
        if (active) setError(err.message || "Ocorreu um erro inesperado.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCharacter();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <main className="detail-state"><div className="loader" /><p>Recuperando registro...</p></main>;
  }

  if (error || !character) {
    return (
      <main className="detail-state">
        <p className="eyebrow">REGISTRO INDISPONÍVEL</p>
        <h1>Arquivo não encontrado</h1>
        <p>{error || "Não há dados para este identificador."}</p>
        <Link href="/" className="back-link">← VOLTAR AO CATÁLOGO</Link>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">✦</span><span>ASTRAL <b>ARCHIVE</b></span></Link>
        <Link href="/" className="topbar-back">← VOLTAR AO ARQUIVO</Link>
      </header>

      <section className="detail-hero">
        <div className="detail-art">
          {character.images.portrait || character.images.icon ? (
            <img src={character.images.portrait || character.images.icon} alt={character.name} />
          ) : <div className="art-fallback">✦</div>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">REGISTRO Nº {character.id}</p>
          <div className="detail-rarity">{"★".repeat(Number(character.rarity) || 0)}</div>
          <h1>{character.name}</h1>
          <div className="detail-tags">
            <span>{character.path.name || "Caminho não informado"}</span>
            <span>{character.element.name || "Elemento não informado"}</span>
          </div>
          <p className="detail-description">{character.description || "Descrição não disponível para este registro."}</p>
          <div className="detail-stats">
            <div><span>RARIDADE</span><strong>{character.rarity || "—"} ★</strong></div>
            <div><span>CAMINHO</span><strong>{character.path.name || "—"}</strong></div>
            <div><span>ELEMENTO</span><strong>{character.element.name || "—"}</strong></div>
          </div>
        </div>
      </section>

      {character.skills?.length > 0 && (
        <section className="detail-section">
          <p className="eyebrow">KIT DE COMBATE</p>
          <h2>Habilidades <em>registradas</em></h2>
          <div className="skill-grid">
            {character.skills.map((skill) => (
              <article className="skill-card" key={skill.id}>
                {skill.icon && <img src={skill.icon} alt="" />}
                <div><h3>{skill.name || "Habilidade"}</h3><p>{skill.type || "Habilidade de combate"}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {character.eidolons?.length > 0 && (
        <section className="detail-section">
          <p className="eyebrow">RESSONÂNCIA</p>
          <h2> Eidolons <em>conhecidos</em></h2>
          <div className="eidolon-list">
            {character.eidolons.map((eidolon, index) => (
              <article className="eidolon-card" key={eidolon.id ?? index}>
                <span className="eidolon-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{eidolon.name || `Eidolon ${index + 1}`}</h3><p>{eidolon.description || "Descrição não disponível."}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="detail-bottom"><Link href="/" className="back-link">← VOLTAR AO CATÁLOGO</Link></div>
      <footer className="footer"><span>ASTRAL ARCHIVE <b>✦</b></span><span>Projeto acadêmico · Desenvolvimento Web III</span><span>Dados: starrail.js</span></footer>
    </main>
  );
}
