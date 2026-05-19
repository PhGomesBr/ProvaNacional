const api = 'http://localhost:3000';

fetch(`${api}/home`)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('cards');
        const container2 = document.getElementById('cards2');
        container.innerHTML = '';

        data.events.forEach(event => {
            const dataFormatada = new Date(event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });
            const horario1 = event.start_time.slice(0, 5);
            const horario2 = event.end_time.slice(0, 5);


            container.innerHTML += `
            <div class="col-md-4"> 
                <div class="card card-item">
                    <div class="card-body">
                        <span class="title-category mb-4 fs-6">${event.type_name}</span>
                        
                        <div class="d-flex justify-content-between mb-3">
                            <h5 class="card-title">${event.name}</h5>
                            <span class="fs-6 fw-medium">${dataFormatada}</span>
                        </div>
                        
                        <p class="card-text text-muted">${event.description}</p>
                        
                        <div class="d-flex justify-content-between text-muted">
                            <span class="fs-6 fw-semibold">${horario1} - ${horario2}</span>
                            <div class="d-flex align-items-center justify-content-center gap-1">
                                <svg class="card-star" viewBox="0 0 100 100" width="16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M50 10 L61.8 38.2 L90 38.2 L67.4 57.4 L78.6 85.8 L50 68.6 L21.4 85.8 L32.6 57.4 L10 38.2 L38.2 38.2 L50 10 Z"
                                        fill="#01C2A5" stroke="#01C2A5" stroke-width="5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <p class="text-rating mb-0">${event.rating || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             `;


        });
        data.tourismSpots.forEach(spot => {
            container2.innerHTML += `
            <div class="col-md-4">
                <div class="card card-item">
   
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <span class="title-type mb-3">tipo</span>
                            <div class="d-flex align-items-center justify-content-center gap-1">
                                <svg class="card-star" viewBox="0 0 100 100" width="16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M50 10 L61.8 38.2 L90 38.2 L67.4 57.4 L78.6 85.8 L50 68.6 L21.4 85.8 L32.6 57.4 L10 38.2 L38.2 38.2 L50 10 Z"
                                        fill="#01C2A5" stroke="#01C2A5" stroke-width="5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <p class="text-rating mb-0">N/A</p>
                            </div>
                        </div>
                        <h5 class="card-title mb-3">${spot.name}</h5>
                        <p class="card-text text-muted">${spot.description}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
            `;
        });
    })
    .catch(error => console.log('Erro:', error));