function enviarMensagem() {
    var celular = "5581999034034";
    var agora = new Date();
    var hora = agora.getHours();
    
    // Define a saudação com base no horário
    var saudacao;
    if (hora >= 5 && hora < 12) {
        saudacao = "Bom dia Gabriel";
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde Gabriel";
    } else {
        saudacao = "Boa noite Gabriel";
    }
    
    // Monta a mensagem com a saudação dinâmica
    var texto = saudacao + ", tudo bem? Gostaria de adquirir o REAL - Simulador de Orçamentos!";
    texto = encodeURIComponent(texto);
    window.open("https://wa.me/" + celular + "?text=" + texto, "_blank");
}
function enviarMensagemSite() {
    var celular = "5581999034034";
    var agora = new Date();
    var hora = agora.getHours();
    
    // Define a saudação com base no horário
    var saudacao;
    if (hora >= 5 && hora < 12) {
        saudacao = "Bom dia Gabriel";
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde Gabriel";
    } else {
        saudacao = "Boa noite Gabriel";
    }
    
    // Monta a mensagem com a saudação dinâmica
    var texto = saudacao + ", tudo bem? Gostaria de integrar o REAL - Simulador de Orçamentos ao site do meu negócio!";
    texto = encodeURIComponent(texto);
    window.open("https://wa.me/" + celular + "?text=" + texto, "_blank");
}
function enviarMensagemInsta() {
    var celular = "5581999034034";
    var agora = new Date();
    var hora = agora.getHours();
    
    // Define a saudação com base no horário
    var saudacao;
    if (hora >= 5 && hora < 12) {
        saudacao = "Bom dia Gabriel";
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde Gabriel";
    } else {
        saudacao = "Boa noite Gabriel";
    }
    
    // Monta a mensagem com a saudação dinâmica
    var texto = saudacao + ", tudo bem? Gostaria de ter o REAL - Simulador de Orçamentos na bio do meu instagram!";
    texto = encodeURIComponent(texto);
    window.open("https://wa.me/" + celular + "?text=" + texto, "_blank");
}