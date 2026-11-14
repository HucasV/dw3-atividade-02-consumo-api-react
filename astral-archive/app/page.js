
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ArchiveGuide from "@/components/ArchiveGuide";

import {
  CharacterLoading,
  CharacterError
} from "@/components/CharacterStates";

// =========================================================
// CONFIGURAÇÕES DOS FILTROS
// =========================================================

const ELEMENTS = [
  "Todos",
  "Físico",
  "Fogo",
  "Gelo",
  "Raio",
  "Vento",
  "Quântico",
  "Imaginário"
];

const PATHS = [
  "Todos",
  "Destruição",
  "Caça",
  "Erudição",
  "Harmonia",
  "Nihilidade",
  "Preservação",
  "Abundância",
  "A Memória"
];

// =========================================================
// CARD DE PERSONAGEM
// =========================================================

function CharacterCard({ character }) {
  return (
    <Link
      className="character-card"
      href={`/characters/${character.id}`}
    >
      <div className="card-art">
        {character.images.portrait || character.images.icon ? (
          <img
            src={character.images.portrait || character.images.icon}
            alt={character.name}
            loading="lazy"
          />
        ) : (
          <div className="art-fallback">✦</div>
        )}

        <span className="rarity">
          {character.rarity}★
        </span>

        <span className="card-open">↗</span>
      </div>

      <div className="card-info">
        <h3>{character.name}</h3>

        <div className="card-tags">
          <span>
            {character.path.name || "Caminho desconhecido"}
          </span>

          <span>
            {character.element.name || "Elemento desconhecido"}
          </span>
        </div>
      </div>
    </Link>
  );
}

// =========================================================
// CATÁLOGO PRINCIPAL
// =========================================================

export default function Catalog() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [element, setElement] = useState("Todos");
  const [path, setPath] = useState("Todos");
  const [rarity, setRarity] = useState("Todas");

  // =======================================================
  // BUSCA DOS PERSONAGENS NA API
  // =======================================================

  useEffect(() => {
    let active = true;

    async function loadCharacters() {
      try {
        const response = await fetch("/api/characters");

        if (!response.ok) {
          throw new Error("Falha ao consultar o catálogo.");
        }

        const data = await response.json();

        if (active) {
          setCharacters(data.characters || []);
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

    loadCharacters();

    return () => {
      active = false;
    };
  }, []);

  // =======================================================
  // FILTRAGEM DOS PERSONAGENS
  // =======================================================

  const filtered = useMemo(() => {
    const normalized = search
      .trim()
      .toLocaleLowerCase("pt-BR");

    return characters.filter((character) => {
      const matchesName = character.name
        .toLocaleLowerCase("pt-BR")
        .includes(normalized);

      const matchesElement =
        element === "Todos" ||
        character.element.name === element;

      const matchesPath =
        path === "Todos" ||
        character.path.name === path;

      const matchesRarity =
        rarity === "Todas" ||
        String(character.rarity) === rarity;

      return (
        matchesName &&
        matchesElement &&
        matchesPath &&
        matchesRarity
      );
    });
  }, [characters, search, element, path, rarity]);

  // =======================================================
  // INTERFACE
  // =======================================================

  return (
    <>
      <main>

        {/* BARRA SUPERIOR */}

        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-mark">✦</span>
            <span>
              ASTRAL <b>ARCHIVE</b>
            </span>
          </Link>

          <span className="topbar-caption">
            DATABASE // HONKAI: STAR RAIL
          </span>
        </header>

        {/* APRESENTAÇÃO */}

        <section className="hero">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-content">
            <p className="eyebrow">
              <span />
              REGISTRO ASTRAL · ESTAÇÃO 001
            </p>

            <h1>
              O universo é vasto.
              <br />
              <em>Re-lembre quem você encontrou</em>
            </h1>

            <p className="hero-copy">
              Ah, olá, Desbravador. Bem-vindo aos arquivos.
              Aqui você reúne informações de todos que encontrou
              em sua jornada rumo ao desconhecido.
            </p>

            <a className="hero-cta" href="#catalogo">
              EXPLORAR ARQUIVO <span>↓</span>
            </a>
          </div>

          <div className="hero-symbol" aria-hidden="true">
            ✧
          </div>

          <div className="hero-index">
            H.S.R. / CHARACTER DATABASE
          </div>
        </section>

        {/* CATÁLOGO */}

        <section className="catalog-section" id="catalogo">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                ARQUIVO DE PERSONAGENS
              </p>

              <h2>
                Viajantes <em>registrados</em>
              </h2>
            </div>

            <div className="result-count">
              <strong>
                {loading ? "—" : filtered.length}
              </strong>

              <span>REGISTROS ENCONTRADOS</span>
            </div>
          </div>

          {/* PESQUISA E FILTROS */}

          <div className="filters">
            <label className="search-box">
              <span>⌕</span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar personagem..."
                aria-label="Buscar personagem"
              />
            </label>

            <select
              value={element}
              onChange={(event) =>
                setElement(event.target.value)
              }
              aria-label="Filtrar por elemento"
            >
              {ELEMENTS.map((item) => (
                <option key={item} value={item}>
                  {item === "Todos"
                    ? "Todos os elementos"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={path}
              onChange={(event) =>
                setPath(event.target.value)
              }
              aria-label="Filtrar por Caminho"
            >
              {PATHS.map((item) => (
                <option key={item} value={item}>
                  {item === "Todos"
                    ? "Todos os Caminhos"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={rarity}
              onChange={(event) =>
                setRarity(event.target.value)
              }
              aria-label="Filtrar por raridade"
            >
              <option value="Todas">
                Todas as raridades
              </option>

              <option value="5">
                5 estrelas
              </option>

              <option value="4">
                4 estrelas
              </option>
            </select>
          </div>

          {/* ESTADO DE CARREGAMENTO */}

          {loading && <CharacterLoading />}

          {/* ESTADO DE ERRO */}

          {!loading && error && (
            <CharacterError message={error} />
          )}

          {/* NENHUM RESULTADO */}

          {!loading && !error && filtered.length === 0 && (
            <div className="state-panel">
              <strong>
                Nenhum registro encontrado.
              </strong>

              <p>
                Tente alterar a busca ou os filtros selecionados.
              </p>
            </div>
          )}

          {/* RESULTADOS */}

          {!loading && !error && filtered.length > 0 && (
            <div className="character-grid">
              {filtered.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                />
              ))}
            </div>
          )}

        </section>

        {/* RODAPÉ */}

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

      {/* TUTORIAL DO DAN HENG */}

      <ArchiveGuide />
    </>
  );
}
