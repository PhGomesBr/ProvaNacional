let soma;

function gerar() {
    //gera os numeros q estará no captcha
    let num1 = Math.floor(Math.random() * 10)+1;
    let num2 = Math.floor(Math.random() * 10)+1;

    soma = num1 + num2;
    //coloca os numero para aparecer na tela
    document.getElementById('captcha').innerText = `${num1} + ${num2}`;
}

function verificar() {
    //pega a resposta do usuario
    let resposta = Number(document.getElementById('resposta').value);

    //ve se bate com o captcha
    if (resposta === soma) {
        alert('Captcha correto');
    } else {
        alert('Captcha errado');
        gerar();
    }
}

gerar();