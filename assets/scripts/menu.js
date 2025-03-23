function clickMenu() {
    const itens = document.getElementById("itens");
    const overlay = document.querySelector(".menu-overlay");
    
    // Alterna a classe 'active' no menu e no overlay
    itens.classList.toggle("active");
    overlay.classList.toggle("active");
}