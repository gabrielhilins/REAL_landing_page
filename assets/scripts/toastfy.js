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