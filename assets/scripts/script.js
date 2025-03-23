// Forçar o scroll para o topo e remover âncora da URL ao carregar a página
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
});

// Inicializando o AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 50,
  startEvent: 'DOMContentLoaded'
});

// Função para mostrar Toastify
function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: type === 'success' ? '#00c49a' : '#ff4444',
    stopOnFocus: true,
  }).showToast();
}

// Função para validar a data
function validateDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const today = new Date();
  const inputDate = new Date(dateString);

  // Verificar ano antes de 2025
  if (year < 2025) {
    return { isValid: false, message: 'O ano não pode ser anterior a 2025!' };
  }

  // Verificar mês maior que 12
  if (month < 1 || month > 12) {
    return { isValid: false, message: 'O mês deve estar entre 1 e 12!' };
  }

  // Verificar dia válido para o mês
  const daysInMonth = new Date(year, month, 0).getDate(); // Último dia do mês
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, message: `O dia deve estar entre 1 e ${daysInMonth} para o mês ${month}!` };
  }

  // Verificar se a data é anterior à data atual
  if (inputDate < today.setHours(0, 0, 0, 0)) {
    return { isValid: false, message: 'A data do serviço não pode ser anterior à data atual!' };
  }

  return { isValid: true };
}

// Lógica do Simulador de Orçamento
document.getElementById('orcamento-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Pegar os valores do formulário
  const nome = document.getElementById('name').value.trim();
  const tipoPiso = document.getElementById('floor-type').value;
  const metrosQuadradosInput = document.getElementById('metros-quadrados');
  const metrosQuadrados = parseFloat(metrosQuadradosInput.value);
  const bairroSelect = document.getElementById('bairro');
  const bairroValue = bairroSelect.value;
  const dataServico = document.getElementById('data-servico').value;

  // Validação da data
  const dateValidation = validateDate(dataServico);
  if (!dateValidation.isValid) {
    showToast(dateValidation.message, 'error');
    document.getElementById('data-servico').focus();
    return;
  }

  // Validação dos metros quadrados
  if (isNaN(metrosQuadrados) || metrosQuadrados <= 0) {
    showToast('Por favor, insira uma quantidade válida de metros quadrados!', 'error');
    metrosQuadradosInput.focus();
    return;
  }

  // Mostrar o loader
  const loader = document.getElementById('loader');
  const simuladorCard = document.querySelector('.simulador-card');
  const recibo = document.getElementById('recibo');
  loader.style.display = 'flex';
  simuladorCard.style.display = 'none';

  // Valores fictícios para o cálculo
  const precosPorMetroQuadrado = {
    ceramica: 50,
    porcelanato: 80,
    madeira: 120
  };

  const custoMaoDeObraPorMetro = 15; // Custo da mão de obra por m² (ajustável)

  const bairrosRecife = {
    'boa-vista': { nome: 'Boa Vista', multiplicador: 1.1 },
    'boa-viagem': { nome: 'Boa Viagem', multiplicador: 1.5 },
    'casa-forte': { nome: 'Casa Forte', multiplicador: 1.3 },
    'varzea': { nome: 'Várzea', multiplicador: 1.0 },
    'pina': { nome: 'Pina', multiplicador: 1.4 }
  };

  const bairroSelecionado = bairrosRecife[bairroValue] || { nome: 'Várzea', multiplicador: 1.0 };
  const precoBasePorMetro = precosPorMetroQuadrado[tipoPiso] || 0;
  const precoBase = precoBasePorMetro * metrosQuadrados; // Custo dos materiais
  const custoMaoDeObra = custoMaoDeObraPorMetro * metrosQuadrados; // Custo da mão de obra
  const multiplicador = bairroSelecionado.multiplicador;
  const precoAjustado = (precoBase + custoMaoDeObra) * multiplicador; // Ajuste por bairro inclui materiais e mão de obra
  const custoServicoInstalacao = 200; // Custo fixo de instalação
  const precoTotal = precoAjustado + custoServicoInstalacao;

  // Simular delay para o loader
  setTimeout(() => {
    loader.style.display = 'none';

    // Preencher o recibo
    document.getElementById('recibo-nome').textContent = nome;
    document.getElementById('recibo-tipo-piso').textContent = tipoPiso.charAt(0).toUpperCase() + tipoPiso.slice(1);
    document.getElementById('recibo-bairro').textContent = bairroSelecionado.nome;
    document.getElementById('recibo-data').textContent = new Date(dataServico).toLocaleDateString('pt-BR');

    const reciboDetalhes = document.getElementById('recibo-detalhes');
    reciboDetalhes.innerHTML = `
      <tr>
        <td>Material (${tipoPiso})</td>
        <td>${metrosQuadrados} m²</td>
        <td>R$${precoBasePorMetro.toFixed(2)}</td>
        <td>R$${precoBase.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Mão de Obra</td>
        <td>${metrosQuadrados} m²</td>
        <td>R$${custoMaoDeObraPorMetro.toFixed(2)}</td>
        <td>R$${custoMaoDeObra.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Transporte (${bairroSelecionado.nome})</td>
        <td>-</td>
        <td>-</td>
        <td>R$${(precoAjustado - (precoBase + custoMaoDeObra)).toFixed(2)}</td>
      </tr>
      <tr>
        <td>Serviço de Instalação de Piso</td>
        <td>-</td>
        <td>-</td>
        <td>R$${custoServicoInstalacao.toFixed(2)}</td>
      </tr>
    `;

    document.getElementById('recibo-total').textContent = precoTotal.toFixed(2);
    recibo.style.display = 'block';
    recibo.scrollIntoView({ behavior: 'smooth' });

    showToast('Orçamento gerado com sucesso!', 'success');
  }, 2000);
});

// Impedir entrada de letras no campo de metros quadrados
document.getElementById('metros-quadrados').addEventListener('input', function (e) {
  this.value = this.value.replace(/[^0-9.]/g, ''); // Remove tudo que não é número ou ponto
  if (this.value.split('.').length > 2) {
    this.value = this.value.replace(/\.+$/, ''); // Permite apenas um ponto decimal
  }
});

// Lógica para "Simular Outro Orçamento"
document.getElementById('simular-outro').addEventListener('click', function () {
  const simuladorCard = document.querySelector('.simulador-card');
  const recibo = document.getElementById('recibo');
  const form = document.getElementById('orcamento-form');

  recibo.style.display = 'none';
  simuladorCard.style.display = 'block';
  form.reset();
  simuladorCard.scrollIntoView({ behavior: 'smooth' });
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

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.getElementById('nav-list');
  const menuOverlay = document.querySelector('.menu-overlay');

  hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuOverlay.classList.toggle('active');
  });

  menuOverlay.addEventListener('click', () => {
    navList.classList.remove('active');
    menuOverlay.classList.remove('active');
  });

  document.addEventListener('click', (event) => {
    if (!navList.contains(event.target) && !hamburger.contains(event.target)) {
      navList.classList.remove('active');
      menuOverlay.classList.remove('active');
    }
  });
});
