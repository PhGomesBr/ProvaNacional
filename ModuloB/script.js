const btnUpload = document.getElementById('btn-upload');
const inputFile = document.getElementById('input-file');
const imageDisplay = document.getElementById('image-display');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const uploudArea = document.getElementById('upload-area')

let images = [];
let indiceAtual = 0;

btnUpload.addEventListener('click', () => {
    btnUpload.hidden = true;
    uploudArea.hidden = true;
    document.getElementById('p').hidden = true
    document.getElementById('input-file').click()
});

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
function atualizarBotoes() {
    btnPrev.hidden = indiceAtual === 0
    btnNext.hidden = indiceAtual === images.length - 1
}

btnPrev.addEventListener('click', () => {
    exibirImagem(indiceAtual - 1);
    atualizarBotoes();
})
btnNext.addEventListener('click', () => {
    exibirImagem(indiceAtual + 1);
    atualizarBotoes();
})

inputFile.addEventListener('change', (e) => {
    // para CADA arquivo que o usuário selecionou
    Array.from(e.target.files).forEach(arquivo => {
        // cria um leitor para ESSE arquivo
        const reader = new FileReader()

        reader.onload = (evento) => {
            images.push({
                src: evento.target.result,
                nome: arquivo.name
            })
            console.log(images) // vê o array crescendo

            //se for primeira img criaa cria tunbinaiel
            if (images.length === 1) {
                exibirImagem(0);
            }
            criarThumbnail(images[images.length - 1], images.length - 1)
        }
        // INICIA a leitura do arquivo
        reader.readAsDataURL(arquivo)
    })
})

function exibirImagem(indice) {
    indiceAtual = indice;
    const imagem = images[indice];
    imageDisplay.innerHTML = '';
    const img = document.createElement('img');
    img.classList.add('exibir');
    img.src = imagem.src;
    imageDisplay.hidden = false;
    imageDisplay.appendChild(img);
    btnNext.hidden = false;
    btnPrev.hidden = false;

}

function criarThumbnail(imagem, indice) {
    const img = document.createElement('img')
    img.src = imagem.src
    img.width = 100        // tamanho pequeno
    img.height = 80

    // quando clicar no thumbnail, exibe a imagem
    img.addEventListener('click', () => {
        exibirImagem(indice)
    })

    document.getElementById('thumbnails').appendChild(img)
}