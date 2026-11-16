
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Recomendações cadastradas manualmente.
// Podemos preencher os personagens individualmente depois.
const BUILD_RECOMMENDATIONS = {};

function formatStat(stat) {
  if (!stat) return "—";

  if (stat.text) return stat.text;

  return Number(stat.value).toLocaleString("pt-BR", {
    maximumFractionDigits: 1
  });
}

export default function CharacterDetails({ id }) {
  const [selectedSuperimposition, setSelectedSuperimposition] =
  useState(1);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCharacter() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/characters/${id}`);

        if (response.status === 404) {
          throw new Error(
            "Esse personagem não foi encontrado no arquivo."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Não foi possível consultar os dados do personagem."
          );
        }

        const data = await response.json();

        if (active) {
          setCharacter(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Ocorreu um erro inesperado."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCharacter();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="detail-state">
        <div className="loader" />
        <p>Recuperando registro...</p>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="detail-state">
        <p className="eyebrow">REGISTRO INDISPONÍVEL</p>

        <h1>Arquivo não encontrado</h1>

        <p>
          {error || "Não há dados para este identificador."}
        </p>

        <Link href="/" className="back-link">
          ← VOLTAR AO CATÁLOGO
        </Link>
      </main>
    );
  }

  const stats = character.baseStats;
  const build = BUILD_RECOMMENDATIONS[character.id];
  const signatureCone = character.signatureLightCone;

  return (
    <main className="detail-page">

      {/* CABEÇALHO */}

      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>
            ASTRAL <b>ARCHIVE</b>
          </span>
        </Link>

        <Link href="/" className="topbar-back">
          ← VOLTAR AO ARQUIVO
        </Link>
      </header>

      {/* NAVEGAÇÃO DA FICHA */}

      <nav className="character-detail-nav">
        <a href="#status">STATUS</a>
        <a href="#skills">SKILLS</a>
        <a href="#signature-cone">CONE DE LUZ</a>
        <a href="#eidolons">EIDOLONS</a>
      </nav>

      {/* IDENTIDADE E STATUS */}

      <section className="detail-hero" id="status">

        <div className="detail-art">
          {character.images?.portrait ||
          character.images?.icon ? (
            <img
              src={
                character.images.portrait ||
                character.images.icon
              }
              alt={character.name}
            />
          ) : (
            <div className="art-fallback">✦</div>
          )}
        </div>

        <div className="detail-copy">

          <p className="eyebrow">
            REGISTRO Nº {character.id}
          </p>

          <div className="detail-rarity">
            {"★".repeat(Number(character.rarity) || 0)}
          </div>

          <h1>{character.name}</h1>

          <div className="detail-tags">
            <span>
              {character.path?.name || "Caminho desconhecido"}
            </span>

            <span>
              {character.element?.name || "Elemento desconhecido"}
            </span>
          </div>

          {/* STATUS */}

          <div className="character-stat-heading">
            <p className="eyebrow">ATRIBUTOS BASE</p>

            <span>
              NÍVEL {stats?.level || 80}
            </span>
          </div>

          <div className="character-stat-grid">

            <article className="character-stat-card">
              <span>HP</span>
              <strong>{formatStat(stats?.hp)}</strong>
            </article>

            <article className="character-stat-card">
              <span>ATQ</span>
              <strong>{formatStat(stats?.attack)}</strong>
            </article>

            <article className="character-stat-card">
              <span>DEF</span>
              <strong>{formatStat(stats?.defense)}</strong>
            </article>

            <article className="character-stat-card">
              <span>VEL</span>
              <strong>{formatStat(stats?.speed)}</strong>
            </article>

          </div>

          <p className="character-stat-note">
            Valores-base no nível 80, ascensão 6.
            Não incluem bônus de equipamentos ou rastros.
          </p>

          {/* DESCRIÇÃO */}

          <div className="character-description-block">
            <p className="eyebrow">REGISTRO BIOGRÁFICO</p>

            <p className="detail-description">
              {character.description ||
                "Descrição não disponível para este registro."}
            </p>
          </div>

        </div>
      </section>

      {/* SKILLS */}

      <section
        className="detail-section character-detail-section"
        id="skills"
      >
        <p className="eyebrow">KIT DE COMBATE</p>

        <h2>
          Habilidades <em>registradas</em>
        </h2>

        {character.skills?.length > 0 ? (
          <div className="character-skills-grid">

            {character.skills.map((skill) => (
              <article
                className="character-skill-card"
                key={skill.id}
              >
                <div className="character-skill-heading">

                  {skill.icon && (
                    <img src={skill.icon} alt="" />
                  )}

                  <div>
                    <span>{skill.type || "HABILIDADE"}</span>

                    <h3>
                      {skill.name || "Habilidade"}
                    </h3>
                  </div>

                </div>

                <p>
                  {skill.description ||
                    "Descrição não disponível para esta habilidade."}
                </p>

                {skill.maxLevel && (
                  <span className="skill-level-note">
                    NÍVEL MÁXIMO: {skill.maxLevel}
                  </span>
                )}
              </article>
            ))}

          </div>
        ) : (
          <div className="state-panel">
            Nenhuma habilidade encontrada.
          </div>
        )}
      </section>

      
{/* CONE DE LUZ ASSINATURA */}

<section
  className="detail-section character-detail-section"
  id="signature-cone"
>
  <p className="eyebrow">EQUIPAMENTO EXCLUSIVO</p>

  <h2>
    Cone de Luz <em>assinatura</em>
  </h2>

  {signatureCone ? (
    <div className="signature-showcase">

      {/* IDENTIDADE DO CONE */}

      <div className="signature-main-card">

        <div className="signature-art">
          {signatureCone.image ? (
            <img
              src={signatureCone.image}
              alt={signatureCone.name}
            />
          ) : (
            <div className="art-fallback">✦</div>
          )}
        </div>

        <div className="signature-info">

          <div className="signature-meta">
            <span>{signatureCone.path}</span>

            <span className="signature-stars">
              {"★".repeat(Number(signatureCone.rarity) || 0)}
            </span>
          </div>

          <h3>{signatureCone.name}</h3>

          <p className="signature-level">
            NÍVEL 80 · ASCENSÃO 6
          </p>

          <div className="signature-stats">

            <article className="signature-stat">
              <span>HP</span>
              <strong>
                {signatureCone.stats?.hp?.text || "—"}
              </strong>
            </article>

            <article className="signature-stat">
              <span>ATQ</span>
              <strong>
                {signatureCone.stats?.attack?.text || "—"}
              </strong>
            </article>

            <article className="signature-stat">
              <span>DEF</span>
              <strong>
                {signatureCone.stats?.defense?.text || "—"}
              </strong>
            </article>

          </div>
        </div>
      </div>

      {/* EFEITO PASSIVO */}

      <div className="signature-effect-card">

        <div className="signature-effect-heading">
          <div>
            <p className="eyebrow">HABILIDADE PASSIVA</p>

            <h3>
              {signatureCone.effectName || "Efeito especial"}
            </h3>
          </div>

          <span className="signature-effect-icon">✦</span>
        </div>

        {/* SELETOR DE SUPERIMPOSIÇÃO */}

        <div className="superimposition-selector">

          <span>SUPERIMPOSIÇÃO</span>

          <div className="superimposition-options">
            {(signatureCone.superimpositions || []).map(
              (item) => (
                <button
                  key={item.rank}
                  type="button"
                  className={
                    selectedSuperimposition === item.rank
                      ? "superimposition-button active"
                      : "superimposition-button"
                  }
                  onClick={() =>
                    setSelectedSuperimposition(item.rank)
                  }
                >
                  S{item.rank}
                </button>
              )
            )}
          </div>
        </div>

        <div className="signature-description">
          {signatureCone.superimpositions?.find(
            (item) =>
              item.rank === selectedSuperimposition
          )?.description || signatureCone.description ||
            "Descrição indisponível."}
        </div>

      </div>

    </div>
  ) : (
    <div className="state-panel">
      Nenhum Cone de Luz assinatura cadastrado.
    </div>
  )}
</section>


      {/* EIDOLONS */}

      <section
        className="detail-section character-detail-section"
        id="eidolons"
      >
        <p className="eyebrow">RESSONÂNCIA</p>

        <h2>
          Eidolons <em>conhecidos</em>
        </h2>

        {character.eidolons?.length > 0 ? (
          <div className="character-eidolon-list">

            {character.eidolons.map((eidolon, index) => (
              <article
                className="character-eidolon-card"
                key={eidolon.id ?? index}
              >

                <span className="character-eidolon-rank">
                  E{eidolon.rank ?? index + 1}
                </span>

                {eidolon.image && (
                  <img
                    src={eidolon.image}
                    alt={eidolon.name || "Eidolon"}
                  />
                )}

                <div className="character-eidolon-info">
                  <h3>
                    {eidolon.name ||
                      `Eidolon ${index + 1}`}
                  </h3>

                  <p>
                    {eidolon.description ||
                      "Descrição não disponível."}
                  </p>
                </div>

              </article>
            ))}

          </div>
        ) : (
          <div className="state-panel">
            Nenhum Eidolon encontrado.
          </div>
        )}
      </section>

      {/* RODAPÉ */}

      <div className="detail-bottom">
        <Link href="/" className="back-link">
          ← VOLTAR AO CATÁLOGO
        </Link>
      </div>

      <footer className="footer">
        <span>
          ASTRAL ARCHIVE <b>✦</b>
        </span>

        <span>
          Projeto acadêmico · Desenvolvimento Web III
        </span>

        <span>
          Dados: starrail.js
        </span>
      </footer>

    </main>
  );
}
