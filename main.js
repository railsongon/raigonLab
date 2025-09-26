// script.js
// Aplica animação diagonal às imagens dentro de .diagonal-track
// e dá variações aleatórias de velocidade/delay/direção.
// Também pausa a animação ao hover (mouse) e retoma ao sair.

(function () {
    const TRACK = document.querySelector('.diagonal-track');
    if (!TRACK) return;
  
    const imgs = Array.from(TRACK.querySelectorAll('.floating'));
  
    // Ajustes: inclinação da diagonal (slope), velocidade base (s)
    const slope = 0.45; // quanto maior, mais "para baixo" a imagem vai enquanto cruza
    const baseDuration = 16; // segundos (duração média)
    const durationVariance = 10; // +/- segundos
  
    // Track bounding (usado para posicionamento inicial)
    function resetImage(img, index) {
      // Escolher direção à esquerda->direita sempre; podemos variar posição vertical inicial
      // posX inicial fora à esquerda (negativo), final será fora à direita
      const containerRect = TRACK.getBoundingClientRect();
  
      // randomiza vertical start entre -20% e 60% do container para variação
      const vStart = (Math.random() * 0.8 - 0.2) * containerRect.height;
  
      // duração aleatória
      const dur = (baseDuration + (Math.random() * durationVariance * 2 - durationVariance)).toFixed(2);
  
      // delay aleatório para que não entrem sincronizadas (negativos permitem começar já 'em movimento')
      const delay = -(Math.random() * dur);
  
      // rotação suave
      const rot = (Math.random() * 8 - 4).toFixed(2);
  
      // aplicar via style: animação keyframes slideDiag (CSS) com duração e delay únicos
      img.style.animationName = 'slideDiag';
      img.style.animationTimingFunction = 'linear';
      img.style.animationIterationCount = 'infinite';
      img.style.animationDuration = dur + 's';
      img.style.animationDelay = delay + 's';
      img.style.transformOrigin = 'center center';
      img.style.zIndex = Math.floor(Math.random() * 10) + 1;
  
      // também ajustamos um translate inicial para vertical offset
      // (coloca imagem inicialmente em posição fora à esquerda, vertical vStart)
      // Usamos transform inline só para o outset; a animação CSS irá sobrepor.
      img.style.left = '-30%'; // valor relativo; a animação cuidará do movimento
      img.style.top = (containerRect.height/2 + vStart) + 'px';
      // aplicar uma rotação leve como ponto de partida
      img.style.transform = `translate(-30%, -50%) rotate(${rot}deg)`;
    }
  
    // setRandoms para todas as imagens
    function setup() {
      // garante que as imagens estejam carregadas para ter altura correta
      imgs.forEach((img, idx) => {
        // se a imagem já tiver a largura, ok; senão espera o carregamento
        if (img.complete) {
          resetImage(img, idx);
        } else {
          img.addEventListener('load', () => resetImage(img, idx));
        }
      });
    }
  
    // pausa ao hover: definimos animationPlayState
    TRACK.addEventListener('mouseenter', () => {
      imgs.forEach(img => {
        img.style.animationPlayState = 'paused';
      });
    });
    TRACK.addEventListener('mouseleave', () => {
      imgs.forEach(img => {
        img.style.animationPlayState = 'running';
      });
    });
  
    // redimensionamento: recalcula posições/duração relativa
    window.addEventListener('resize', () => {
      // pequeno debounce
      clearTimeout(window._rlResize);
      window._rlResize = setTimeout(() => {
        imgs.forEach((img, idx) => resetImage(img, idx));
      }, 120);
    });
  
    setup();
  })();
  