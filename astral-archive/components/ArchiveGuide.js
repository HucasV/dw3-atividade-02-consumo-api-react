
"use client";

import { useEffect, useState } from "react";

const DAN_HENG_IMAGE =
  "https://s3.getstickerpack.com/storage/uploads/sticker-pack/dan-heng/sticker_3.png?6161415efd7e63da7053229c1d938e4a";

const GUIDE_STEPS = [
  {
    file: "INTRODUÇÃO",
    title: "Bem-vindo ao Arquivo Astral.",
    text: "Sou Dan Heng. Ficarei responsável por apresentar a organização deste arquivo. Aqui, cada registro tem seu próprio lugar. Acompanhe-me e explicarei onde encontrar cada informação."
  },
  {
    file: "app/page.js",
    title: "O ponto de partida.",
    text: "Este arquivo representa a página inicial do projeto. É onde a interface do catálogo é montada, incluindo a apresentação dos personagens e os elementos de pesquisa e filtragem."
  },
  {
    file: "app/api/characters/route.js",
    title: "A central de registros.",
    text: "Esta é a rota da API. Quando a aplicação consulta /api/characters, este arquivo prepara os dados e devolve a lista de personagens em formato JSON."
  },
  {
    file: "lib/starrail.js",
    title: "A biblioteca de dados.",
    text: "Aqui está a integração com o StarRail.js. Este arquivo administra o cliente, o cache e a conversão dos dados originais do jogo para um formato que nossa interface consegue utilizar."
  },
  {
    file: "app/globals.css",
    title: "A identidade visual.",
    text: "Toda a aparência global está aqui: paleta de cores, fontes, espaçamentos, cards, animações e adaptação para dispositivos móveis. Alterações visuais geralmente começam neste arquivo."
  },
  {
    file: "components/",
    title: "Peças reutilizáveis.",
    text: "Nesta pasta ficam componentes independentes que podem ser utilizados em diferentes telas. Por exemplo, criamos aqui os estados da Herta e da Huohuo e este próprio tutorial."
  },
  {
    file: "ENCERRAMENTO",
    title: "Tudo em seu devido lugar.",
    text: "Agora você conhece a estrutura principal do Arquivo Astral. Uma regra importante: antes de alterar qualquer sistema, procure primeiro o arquivo responsável por aquela função. Isso tornará suas modificações muito mais organizadas."
  }
];

export default function ArchiveGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
      const alreadySeen = localStorage.getItem(
        "astral-archive-guide-seen"
      );

      if (alreadySeen !== "true") {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  function closeGuide() {
    try {
      localStorage.setItem(
        "astral-archive-guide-seen",
        "true"
      );
    } catch {
      // O tutorial continua podendo ser fechado
      // mesmo quando o navegador bloqueia o armazenamento.
    }

    setIsOpen(false);
    setCurrentStep(0);
  }

  function nextStep() {
    if (currentStep >= GUIDE_STEPS.length - 1) {
      closeGuide();
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function previousStep() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  function reopenGuide() {
    setCurrentStep(0);
    setIsOpen(true);
  }

  const step = GUIDE_STEPS[currentStep];

  return (
    <>
      <button
        type="button"
        className="guide-help"
        onClick={reopenGuide}
        aria-label="Abrir tutorial do Arquivo Astral"
        title="Ajuda do Arquivo Astral"
      >
        ?
      </button>

      {isOpen && (
        <div
          className="guide-overlay"
          onClick={closeGuide}
        >
          <section
            className="guide-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guide-character">
              <span className="guide-character-caption">
                ASTRAL ARCHIVE // GUIDE
              </span>

              <img
                src={DAN_HENG_IMAGE}
                alt="Dan Heng"
              />
            </div>

            <div className="guide-copy">
              <button
                type="button"
                className="guide-close"
                onClick={closeGuide}
                aria-label="Fechar tutorial"
              >
                ×
              </button>

              <p className="guide-eyebrow">
                ORIENTAÇÃO INICIAL
              </p>

              <p className="guide-speaker">
                DAN HENG
                <span>ARQUIVISTA</span>
              </p>

              <h2 id="guide-title" key={currentStep}>
                {step.title}
              </h2>

              <p className="guide-text" key={`text-${currentStep}`}>
                {step.text}
              </p>

              <div
                className="guide-progress"
                aria-label={`Etapa ${currentStep + 1} de ${GUIDE_STEPS.length}`}
              >
                {GUIDE_STEPS.map((item, index) => (
                  <span
                    key={item.file}
                    className={index <= currentStep ? "active" : ""}
                  />
                ))}
              </div>

              <div className="guide-actions">
                <button
                  type="button"
                  className="guide-skip"
                  onClick={closeGuide}
                >
                  Pular tutorial
                </button>

                <div className="guide-navigation">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      className="guide-previous"
                      onClick={previousStep}
                    >
                      Anterior
                    </button>
                  )}

                  <button
                    type="button"
                    className="guide-next"
                    onClick={nextStep}
                  >
                    {currentStep === GUIDE_STEPS.length - 1
                      ? "Concluir"
                      : "Continuar →"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
