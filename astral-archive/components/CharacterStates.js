
const HUO_HUO_GIF =
  "https://upload-os-bbs.hoyolab.com/upload/2025/08/22/142226801/5f56b824dd61d6d6a207c08bec11635f_3768188926870144912.gif";

const HERTA_GIF =
  "https://upload-os-bbs.hoyolab.com/upload/2025/02/08/137838289/5fe66cd9661184cb18d19f2860dac1b8_6727680558544446849.gif";

export function CharacterLoading() {
  return (
    <section className="character-state" role="status" aria-live="polite">
      <img
        src={HERTA_GIF}
        alt="Animação da Herta"
      />

      <h2>Carregamento ultrarrápido da Herta</h2>

      <p>
        Organizando os registros do Arquivo Astral...
      </p>
    </section>
  );
}

export function CharacterError({ message }) {
  const description =
    typeof message === "string" && message.trim()
      ? message
      : "Não foi possível localizar os registros solicitados.";

  return (
    <section className="character-state character-error" role="alert">
      <img
        src={HUO_HUO_GIF}
        alt="Animação da Huohuo"
      />

      <h2>
        Ops! A Huohuo está fazendo o máximo para encontrar os personagens.
      </h2>

      <p>{description}</p>
    </section>
  );
}
