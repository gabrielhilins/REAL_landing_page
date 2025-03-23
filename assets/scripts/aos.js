// Forçar o scroll para o topo e remover âncora da URL ao carregar a página
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
    }
  });
  
// Inicializando o AOS
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
        startEvent: 'DOMContentLoaded'
      });
    } else {
      console.error('AOS library is not loaded.');
    }
  });

  // Scroll suave para links do header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = document.querySelector('header').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });