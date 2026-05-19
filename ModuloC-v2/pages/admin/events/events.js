const api = 'http://localhost:3000';

fetch(`${api}/home`)
    .then(res => res.json())
    .then(data => {

        const table = document.getElementById('eventsTable');

        data.events.forEach(event => {
            const dataFormatada = new Date(event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });

            const inicio = event.start_time.slice(0, 5);
            const fim = event.end_time.slice(0, 5);

            table.innerHTML += `
                <tr>
                    <td>${event.id}</td>
                    <td>${event.name}</td>
                    <td>${event.type_name}</td>
                    <td>${dataFormatada}</td>
                    <td>${inicio} - ${fim}</td>
                    <td>${event.people_quantity}</td>                    
                    <td>
                        <button style="background-color: #a9c3d8;">Editar</button>
                        <button style="background-color: #fa9198;" onclick="deletarEvento(${event.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    });
function abrirModal() {
    document.getElementById('overlay').style.display = 'flex';
};
function fecharModal() {
    document.getElementById('overlay').style.display = 'none';
};

async function deletarEvento(id) {

    const confirmar = confirm('Deseja excluir este evento?');

    if (!confirmar) return;

    const response = await fetch(`http://localhost:3000/admin/events/${id}`, {
        method: 'DELETE'
    });

    const data = await response.json();

    alert(data.message);

    location.reload();
}