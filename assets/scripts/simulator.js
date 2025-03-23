// Função para enviar mensagem via WhatsApp
function enviarWhatsApp(nome, tipoPiso, bairro, dataServico, precoBase, custoMaoDeObra, precoAjustado, custoServicoInstalacao, precoTotal) {
    // Formatar a data corretamente
    const dataFormatada = new Date(dataServico).toLocaleDateString('pt-BR');
    
    // Construir a mensagem com \n explícito e bullets (-)
    const mensagem = "Olá! Gostaria de solicitar o orçamento gerado para a instalação de piso.\n\n" +
                    "- Cliente: " + nome + "\n" +
                    "- Tipo de Serviço: Instalação Piso\n" +
                    "- Tipo de Piso: " + tipoPiso + "\n" +
                    "- Localização: " + bairro + "\n" +
                    "- Data para Execução: " + dataFormatada + "\n\n" +
                    "Detalhamento:\n" +
                    "- Material (" + tipoPiso + "): R$" + precoBase.toFixed(2) + "\n" +
                    "- Mão de Obra: R$" + custoMaoDeObra.toFixed(2) + "\n" +
                    "- Transporte (" + bairro + "): R$" + (precoAjustado - (precoBase + custoMaoDeObra)).toFixed(2) + "\n" +
                    "- Serviço de Instalação: R$" + custoServicoInstalacao.toFixed(2) + "\n\n" +
                    "- Total do Orçamento: R$" + precoTotal.toFixed(2) + "\n\n" +
                    "Agradeço a atenção!";

    const url = `https://wa.me/5581999034034?text=${encodeURIComponent(mensagem)}`;
    
    // Redirecionar para o WhatsApp
    window.open(url, '_blank');
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
    // Reiniciar o loader caso ele tenha sido ocultado antes
    loader.style.display = 'none';
    void loader.offsetWidth;
    loader.style.display = 'flex';
    const simuladorCard = document.querySelector('.simulador-card');
    const recibo = document.getElementById('recibo');
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

    // Enviar para WhatsApp
    const whatsappButton = document.getElementById('whatsapp-button');
    whatsappButton.addEventListener('click', () => {
      enviarWhatsApp(nome, tipoPiso, bairroSelecionado.nome, dataServico, precoBase, custoMaoDeObra, precoAjustado, custoServicoInstalacao, precoTotal);
    });

    // Mostrar o botão do WhatsApp
    whatsappButton.style.display = 'block';
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
  
  // Impedir entrada de letras no campo de metros quadrados
document.getElementById('metros-quadrados').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9.]/g, ''); // Remove tudo que não é número ou ponto
    if (this.value.split('.').length > 2) {
      this.value = this.value.replace(/\.+$/, ''); // Permite apenas um ponto decimal
    }
});
