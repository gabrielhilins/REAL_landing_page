function toggleMenu() {
    const menu = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const burguer = document.getElementById('burguer');
    const isExpanded = burguer.getAttribute('aria-expanded') === 'true';
    
    // Alterna o estado do menu
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    burguer.setAttribute('aria-expanded', !isExpanded);
    
    // Alterna entre ícone de hambúrguer e X com animação suave
    if (menu.classList.contains('active')) {
        // Fecha o ícone de hambúrguer (transforma em X)
        burguer.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        document.body.style.overflow = 'hidden';
    } else {
        // Volta para o ícone de hambúrguer
        burguer.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = '';
    }
}

function handleNavClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Fecha o menu mobile se estiver aberto
    if (document.querySelector('.mobile-sidebar').classList.contains('active')) {
        toggleMenu();
    }
}

// Fecha o menu ao clicar no overlay
document.querySelector('.sidebar-overlay').addEventListener('click', toggleMenu);

// Fecha o menu ao redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const menu = document.querySelector('.mobile-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const burguer = document.getElementById('burguer');
        
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            burguer.innerHTML = '<i class="fa-solid fa-bars"></i>';
            burguer.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
});

// Fecha o menu ao pressionar Esc
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const menu = document.querySelector('.mobile-sidebar');
        if (menu.classList.contains('active')) {
            toggleMenu();
        }
    }
});