function copiarLink() {
    const url = "https://real-iota-ivory.vercel.app/";
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copiado com sucesso!");
    });
  }