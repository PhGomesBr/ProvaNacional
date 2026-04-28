const zone = document.getElementById('dropZone');
const input = document.getElementById('fileInput');

zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragging');
});

zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragging');
});

zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
});

input.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        processFile(e.target.files[0]);
    }
});

function processFile(file) {
    // Pega o elemento de erro
    const erro = document.getElementById('erro');
    erro.textContent = ''; // limpa erro anterior

    // Validação 1: formato
    const formatosValidos = ['image/jpg', 'image/png'];

    if (!formatosValidos.includes(file.type)) {
        erro.textContent = 'Formato inválido. Use JPG ou PNG.';
        return; // para tudo aqui
    }

    // Validação 2: tamanho (2MB = 2 * 1024 * 1024)
    const maxBytes = 2 * 1024 * 1024;

    if (file.size > maxBytes) {
        erro.textContent = 'Arquivo muito grande. Máximo 2MB.';
        return; // para tudo aqui
    }

    //cria o leitor do arquivo
    const reader = new FileReader();

    // Quando terminar de ler → dispara onload
    reader.onload = function (e) {
        const dataURL = e.target.result;
        // dataURL é algo como:
        // "data:image/png;base64,iVBORw0KGgo..."

        //coloca o elemento <img> para mostratar
        const previw = document.getElementById('previw')
        previw.src = dataURL;
        previw.style.display = 'block';

        simularUpload();
    };

    //disdpara a leitura(só depois disso o onload roda)
    reader.readAsDataURL(file);
}

function simularUpload() {
    const bar = document.getElementById('progressBar');
    const fill = document.getElementById('progressFill');

    bar.style.display = 'block';
    let progresso = 0;

    const intervalo = setInterval(() => {
        progresso += 2 //+2% por tick
        fill.style.width = progresso + '%';

        if (progresso >= 100) {
            clearInterval(intervalo); //para aqui
        }
    }, 30) //a cada 30 ms
}