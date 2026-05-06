const btnUpload = document.getElementById('btn-upload');
const inputFile = document.getElementById('input-file');
const imageDisplay = document.getElementById('image-display');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const uploudArea = document.getElementById('upload-area');
const botoesTema = document.querySelectorAll('.btn-tema');

let images = [];
let indiceAtual = 0;
let temaAtual = 'A'; // Padrão Tema A

// Seleção de Temas
botoesTema.forEach(btn => {
    btn.addEventListener('click', () => {
        botoesTema.forEach(b => b.style.backgroundColor = '');
        btn.style.backgroundColor = 'blue';
        temaAtual = btn.getAttribute('data-tema');
        console.log(`Tema selecionado: ${temaAtual}`);
    });
});

// Upload de Arquivos
btnUpload.addEventListener('click', () => {
    inputFile.click();
});

inputFile.addEventListener('change', (e) => {
    carregarArquivos(e.target.files);
});

// Drag and Drop
['dragover', 'drop'].forEach(eventName => {
    uploudArea.addEventListener(eventName, (e) => e.preventDefault());
});

uploudArea.addEventListener('dragover', () => {
    uploudArea.style.borderColor = '#000';
    uploudArea.style.backgroundColor = '#f0f0f0';
});

uploudArea.addEventListener('dragleave', () => {
    uploudArea.style.borderColor = '#ccc';
    uploudArea.style.backgroundColor = 'transparent';
});

uploudArea.addEventListener('drop', (e) => {
    carregarArquivos(e.dataTransfer.files);
    uploudArea.style.backgroundColor = 'transparent';
    uploudArea.style.borderColor = '#ccc';
});

function carregarArquivos(arquivos) {
    Array.from(arquivos).forEach(arquivo => {
        if (!arquivo.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (evento) => {
            images.push({
                src: evento.target.result,
                nome: arquivo.name
            });

            esconderUpload();

            if (images.length === 1) {
                exibirImagem(0);
            }
            criarThumbnail(images[images.length - 1], images.length - 1);
        };
        reader.readAsDataURL(arquivo);
    });
}

function esconderUpload() {
    btnUpload.hidden = true;
    uploudArea.hidden = true;
    const p = document.getElementById('p');
    if (p) p.hidden = true;
}

// Navegação
function atualizarBotoes() {
    btnPrev.hidden = indiceAtual === 0;
    btnNext.hidden = indiceAtual === images.length - 1;
}

btnPrev.addEventListener('click', () => {
    if (indiceAtual > 0) {
        exibirImagem(indiceAtual - 1);
    }
});

btnNext.addEventListener('click', () => {
    if (indiceAtual < images.length - 1) {
        exibirImagem(indiceAtual + 1);
    }
});

// Atalhos de Teclado
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const comandBar = document.getElementById('comandBar');
        comandBar.style.display = (comandBar.style.display === 'none' || comandBar.style.display === '') ? "flex" : "none";
    }
});

// Exibição de Imagem com Temas
function exibirImagem(indice) {
    const imagemAntiga = imageDisplay.querySelector('img');
    const novaImagemData = images[indice];
    
    const imgNova = document.createElement('img');
    imgNova.src = novaImagemData.src;
    imageDisplay.hidden = false;

    // Aplicar Lógica de Temas
    switch (temaAtual) {
        case 'A':
            // Tema A – Passagem da esquerda para a direita, sobrepondo a imagem anterior
            imgNova.classList.add('temaA-exibir');
            imageDisplay.appendChild(imgNova);
            setTimeout(() => {
                if (imagemAntiga) imagemAntiga.remove();
            }, 500);
            break;

        case 'B':
            // Tema B – Fade in da esquerda, Fade out para a direita
            imgNova.classList.add('temaB-in');
            if (imagemAntiga) {
                imagemAntiga.classList.remove('temaB-in');
                imagemAntiga.classList.add('temaB-out');
                setTimeout(() => imagemAntiga.remove(), 500);
            }
            imageDisplay.appendChild(imgNova);
            break;

        case 'C':
            // Tema C – Direções aleatórias, Rotações (max 20º), Zoom Out (120% para 100%)
            const direcoes = [
                { x: '-150%', y: '0' },
                { x: '150%', y: '0' },
                { x: '0', y: '-150%' },
                { x: '0', y: '150%' }
            ];
            const dir = direcoes[Math.floor(Math.random() * direcoes.length)];
            const rot = (Math.random() * 40 - 20).toFixed(2); // -20 a 20
            
            imgNova.style.transform = `translate(${dir.x}, ${dir.y}) scale(1.2) rotate(${rot}deg)`;
            imgNova.classList.add('temaC-img');
            imageDisplay.appendChild(imgNova);
            
            // Forçar reflow
            imgNova.offsetHeight; 
            
            imgNova.style.transform = `translate(0, 0) scale(1) rotate(${rot}deg)`;
            
            if (imagemAntiga) {
                imagemAntiga.style.opacity = '0';
                setTimeout(() => imagemAntiga.remove(), 600);
            }
            break;

        case 'D':
            // Tema D – Zoom in (90% para 100%) com fade in, rotação inicial (max 10°) e final 0
            const rotD = (Math.random() * 20 - 10).toFixed(2); // -10 a 10
            imgNova.style.setProperty('--rot-inicial', `${rotD}deg`);
            imgNova.classList.add('temaD-in');
            imageDisplay.appendChild(imgNova);
            
            if (imagemAntiga) {
                imagemAntiga.style.opacity = '0';
                setTimeout(() => imagemAntiga.remove(), 500);
            }
            break;

        default:
            imageDisplay.innerHTML = '';
            imageDisplay.appendChild(imgNova);
    }

    indiceAtual = indice;
    atualizarBotoes();
}

// Thumbnails e Reordenação
const mudar = document.getElementById('mudar');
let muda = false;

mudar.addEventListener('click', () => {
    muda = !muda;
    mudar.style.color = muda ? 'blue' : 'black';
});

let marker = null;

function mostrarMarker(imgAlvo) {
    removerMarker();
    marker = document.createElement('div');
    marker.style.cssText = `
        width: 3px;
        height: 80px;
        background-color: #2b7cff;
        border-radius: 2px;
        pointer-events: none;
        flex-shrink: 0;
    `;
    imgAlvo.parentNode.insertBefore(marker, imgAlvo);
}

function removerMarker() {
    if (marker) { marker.remove(); marker = null; }
}

function reordenarImagens(origem, destino) {
    if (origem === destino) return;

    const imgMovida = images.splice(origem, 1)[0];
    images.splice(destino, 0, imgMovida);

    if (indiceAtual === origem) indiceAtual = destino;
    else if (origem < indiceAtual && destino >= indiceAtual) indiceAtual--;
    else if (origem > indiceAtual && destino <= indiceAtual) indiceAtual++;

    renderizarThumbnails();
}

function renderizarThumbnails() {
    const container = document.getElementById('thumbnails');
    container.innerHTML = '';
    images.forEach((img, i) => criarThumbnail(img, i));
}

function criarThumbnail(imagem, indice) {
    const img = document.createElement('img');
    img.src = imagem.src;
    img.width = 100;
    img.height = 80;
    img.draggable = true;
    img.dataset.index = indice;

    img.addEventListener('click', () => exibirImagem(indice));

    img.addEventListener('dragstart', (e) => {
        if (!muda) return;
        e.dataTransfer.setData('index', indice);
    });

    img.addEventListener('dragover', (e) => {
        if (!muda) return;
        e.preventDefault();
        mostrarMarker(img);
    });

    img.addEventListener('dragleave', () => {
        if (!muda) return;
        removerMarker();
    });

    img.addEventListener('drop', (e) => {
        if (!muda) return;
        e.preventDefault();
        const origem = parseInt(e.dataTransfer.getData('index'));
        const destino = parseInt(img.dataset.index);
        reordenarImagens(origem, destino);
        removerMarker();
    });

    document.getElementById('thumbnails').appendChild(img);
}
