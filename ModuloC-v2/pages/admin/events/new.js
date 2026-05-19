const api = 'http://localhost:3000';
const form = document.querySelector('form');

// Popula selects
fetch(`${api}/admin/events`)
    .then(res => res.json())
    .then(data => {
        const selectDistrito = document.getElementById('distrito');
        const eventTipo = document.getElementById('tipo_evento');

        data.districts.forEach(item => {
            selectDistrito.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });
        data.types.forEach(item => {
            eventTipo.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });
    });

// Preview da imagem no console
const image = document.getElementById('imagem');
image.addEventListener('change', (e) => {
    const file = e.target.files[0];
    console.log("File Name:", file.name);
    const reader = new FileReader();
    reader.onload = (event) => console.log("File Content:", event.target.result);
    reader.readAsDataURL(file);
});

// Converte arquivo pra base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const imagemBase64 = await toBase64(document.getElementById('imagem').files[0]);
    const folhetoBase64 = await toBase64(document.getElementById('folheto').files[0]);

    const dados = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        data: document.getElementById('data').value,
        hora_inicio: document.getElementById('hora_inicio').value,
        hora_termino: document.getElementById('hora_termino').value,
        tipo_evento: document.getElementById('tipo_evento').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        distrito: document.getElementById('distrito').value,
        capacidade: document.getElementById('capacidade').value,
        link_visualizacao: document.getElementById('link_visualizacao').value,
        imagem: imagemBase64,
        folheto: folhetoBase64,
    };

    fetch(`${api}/admin/events/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
        .then(res => res.json())
        .then(data => console.log('Sucesso:', data))
        .catch(err => console.error('Erro:', err));
    
    window.location.href = 'events.html';
});