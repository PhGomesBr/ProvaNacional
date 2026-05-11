let soma;

function gerar() {
    let num1 = Math.floor(Math.random() * 10)+1;
    let num2 = Math.floor(Math.random() * 10)+1;

    soma = num1 + num2;

    document.getElementById('captcha').innerText = `${num1} + ${num2}`;
}

function verificar() {
    let resposta = Number(document.getElementById('resposta').value);

    if (resposta === soma) {
        alert('Captcha correto');
    } else {
        alert('Captcha errado');
        gerar();
    }
}

gerar();