const apiUrl = 'http://localhost:3000';
const loginForm = document.getElementById('loginForm');

async function getLogin(email, password) {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // envia os dados que o servidor espera (data.email, data.password)
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Se o servidor mandar 401 ou 404 de usuário, cai aqui
            console.warn("Aviso do servidor:", data.mensagem);
            return;
        }

        console.log('Login realizado:', data.mensagem);

    } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
    }
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede a página de recarregar

    // Pegamos os valores APENAS no momento do clique
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    // Chamamos a função passando os valores capturados
    getLogin(email, password);
});