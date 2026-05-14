const apiUrl = 'http://localhost:3000';
const loginForm = document.getElementById('loginForm');

async function getLogin(email, password) {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.warn('Aviso do servidor:', data.message);
            return;
        }

        // salva o token no navegador
        localStorage.setItem('token', data.token);

        // redireciona após login
        window.location.href = 'home.html';

    } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
    }
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    getLogin(email, password);
});