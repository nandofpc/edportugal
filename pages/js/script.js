// script.js
// Função para validar CPF (algoritmo completo)
function validaCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Função para aplicar máscara de CPF
function aplicaMascaraCPF(input) {
  if (!input) return; // Se o campo não existir, ignora

  input.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    let out = v;
    if (v.length > 3) out = v.slice(0, 3) + '.' + out.slice(3);
    if (v.length > 6) out = out.slice(0, 7) + '.' + out.slice(7);
    if (v.length > 9) out = out.slice(0, 11) + '-' + out.slice(11);
    e.target.value = out;
  });

  input.addEventListener('blur', function (e) {
    const cpf = e.target.value.replace(/\D/g, '');
    if (cpf && !validaCPF(cpf)) {
      e.target.setCustomValidity('CPF inválido!');
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity('');
    }
  });
}

// Função para aplicar máscara de RG
function aplicaMascaraRG(input) {
  if (!input) return;

  input.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 9);
    let out = v;
    if (v.length > 2) out = v.slice(0, 2) + '.' + out.slice(2);
    if (v.length > 5) out = out.slice(0, 6) + '.' + out.slice(6);
    if (v.length > 8) out = out.slice(0, 10) + '-' + out.slice(10);
    e.target.value = out;
  });
}

// Função para aplicar máscara de celular
function aplicaMascaraCelular(input) {
  if (!input) return;

  input.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    let out = v;
    if (v.length > 0) out = '(' + v.slice(0, 2) + ')';
    if (v.length > 2) out += ' ' + v.slice(2, 7);
    if (v.length > 7) out += '-' + v.slice(7, 11);
    e.target.value = out;
  });

  input.addEventListener('blur', function (e) {
    const tel = e.target.value.replace(/\D/g, '');
    if (tel && tel.length !== 11) {
      e.target.setCustomValidity('O celular deve ter 11 dígitos (com DDD).');
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity('');
    }
  });
}

// Função para aplicar máscara de CEP
function aplicaMascaraCEP(input) {
  if (!input) return;

  input.addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    e.target.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v;
  });
}

// Função para buscar endereço por CEP (via ViaCEP)
function buscaEnderecoPorCEP(cepInput, logradouro, bairro, cidade, uf) {
  if (!cepInput) return;

  cepInput.addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          if (logradouro) logradouro.value = data.logradouro;
          if (bairro) bairro.value = data.bairro;
          if (cidade) cidade.value = data.localidade;
          if (uf) uf.value = data.uf;
        } else {
          alert('CEP não encontrado.');
        }
      })
      .catch(err => {
        console.error('Erro ao buscar CEP:', err);
        alert('Erro ao buscar o CEP. Verifique sua conexão.');
      });
  });
}

// Função para formatar data (YYYY-MM-DD → DD/MM/YYYY)
function formataData(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Função genérica para adicionar item dinâmico
function addDynamicItem(containerId, template, countVar) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.innerHTML = template(countVar.value);
  container.appendChild(item);

  // Aplica máscaras nos novos campos, se existirem
  const cpfInput = item.querySelector('input[name*="cpf"], input[name*="doc"], input[name*="CPF"]');
  if (cpfInput) aplicaMascaraCPF(cpfInput);

  const celularInput = item.querySelector('input[type="tel"], input[name*="celular"], input[name*="telefone"]');
  if (celularInput) aplicaMascaraCelular(celularInput);

  const rgInput = item.querySelector('input[name*="rg"], input[name*="RG"]');
  if (rgInput) aplicaMascaraRG(rgInput);

  countVar.value++;
}

// Função para tocar animais (mostrar/ocultar)
function toggleAnimais() {
  const selected = document.querySelector('input[name="animais"]:checked')?.value;
  const container = document.getElementById('animais-info');
  if (container) {
    container.style.display = selected === 'Sim' ? 'block' : 'none';
    if (selected !== 'Sim') {
      const lista = document.getElementById('animais-list');
      if (lista) lista.innerHTML = '';
    }
  }
}

// Função para tocar endereço de boleto
function toggleEnderecoBoleto() {
  const selected = document.querySelector('input[name="receber_boleto"]:checked')?.value;
  const container = document.getElementById('endereco-boleto');
  if (container) {
    container.style.display = selected === 'Sim' ? 'block' : 'none';
  }
}

// Função para gerar PDF (genérica - pode ser expandida por página)
function geraPDF(doc, titulo, logoUrl = null) {
  doc.setFillColor(26, 59, 93);
  doc.rect(0, 0, 210, 28, 'F');
  if (logoUrl) {
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 4, 20, 20);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(titulo, 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Edifício Portugal', 105, 23, { align: 'center' });
    };
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(titulo, 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Edifício Portugal', 105, 23, { align: 'center' });
  }
  doc.setTextColor(0, 0, 0);
}

// Função principal: inicia quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
  // Aplica máscaras onde os campos existirem
  aplicaMascaraCPF(document.querySelector('input[name="cpf_morador"]'));
  aplicaMascaraCPF(document.querySelector('input[name^="funcionario_doc_"]'));
  aplicaMascaraCPF(document.querySelector('input[name="prestador_cpf"]'));

  aplicaMascaraRG(document.querySelector('input[name="rg_morador"]'));

  aplicaMascaraCelular(document.querySelector('input[name="celular"]'));
  aplicaMascaraCelular(document.querySelector('input[name="contato_celular_0"]'));

  aplicaMascaraCEP(document.getElementById('boleto_cep'));

  // Busca CEP
  const cepInput = document.getElementById('boleto_cep');
  if (cepInput) {
    buscaEnderecoPorCEP(
      cepInput,
      document.getElementById('boleto_logradouro'),
      document.getElementById('boleto_bairro'),
      document.getElementById('boleto_cidade'),
      document.getElementById('boleto_uf')
    );
  }

  // Inicializa radio buttons
  const animaisRadio = document.querySelector('input[name="animais"][value="Sim"]');
  if (animaisRadio) {
    animaisRadio.addEventListener('change', toggleAnimais);
    toggleAnimais(); // Verifica estado inicial
  }

  const boletoRadio = document.querySelector('input[name="receber_boleto"]');
  if (boletoRadio) {
    document.querySelectorAll('input[name="receber_boleto"]').forEach(radio => {
      radio.addEventListener('change', toggleEnderecoBoleto);
    });
    toggleEnderecoBoleto(); // Verifica estado inicial
  }

  // Inicializa contatos de emergência (exemplo)
  if (document.getElementById('contatos-emergencia-list')) {
    window.contatoEmergenciaCount = { value: 0 };
    addContatoEmergencia(); // Chame uma vez se for obrigatório
  }

  // Define funções globais para uso no HTML (onclick)
  window.toggleAnimais = toggleAnimais;
  window.toggleEnderecoBoleto = toggleEnderecoBoleto;
  window.addVeiculo = () => addDynamicItem('veiculos-list', templateVeiculo, { value: window.veiculoCount || (window.veiculoCount = 0) });
  window.addContatoEmergencia = () => addDynamicItem('contatos-emergencia-list', templateContato, { value: window.contatoEmergenciaCount?.value || 0 });
  window.addMorador = () => addDynamicItem('moradores-list', templateMorador, { value: window.moradorCount || (window.moradorCount = 0) });
  window.addFuncionario = () => addDynamicItem('funcionarios-list', templateFuncionario, { value: window.funcionarioCount || (window.funcionarioCount = 0) });
  window.addAnimal = () => addDynamicItem('animais-list', templateAnimal, { value: window.animalCount || (window.animalCount = 0) });
  window.addPrestador = () => addDynamicItem('prestadores-list', templatePrestador, { value: window.prestadorCount || (window.prestadorCount = 0) });

//PDF OBRAS
    // Adicionar um prestador inicial
    document.addEventListener('DOMContentLoaded', function() {
      addPrestador();
    });

    // Função para formatar data
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }

    // Gerar PDF e abrir email
    document.getElementById('formaObra').addEventListener('submit', function(e) {
      e.preventDefault();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const formData = new FormData(this);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

        // Coletar prestadores
        const prestadores = [];
        const prestadorDivs = document.querySelectorAll('#prestadores-list .dynamic-item');
        prestadorDivs.forEach(div => {
        const nome = div.querySelector('input[name^="prestador_nome"]').value.trim();
        const cpf = div.querySelector('input[name^="prestador_cpf"]').value.trim();
        const funcao = div.querySelector('input[name^="prestador_funcao"]').value.trim();
        const celular = div.querySelector('input[name^="prestador_celular"]').value.trim();
        if (nome && cpf && funcao && celular) {
            prestadores.push([nome, cpf, funcao, celular]);
        }
        });

        // Validação: pelo menos um prestador completo
        if (prestadores.length === 0) {
        alert('Adicione pelo menos um prestador de serviço com todos os campos preenchidos.');
        return;
}

      // Cabeçalho do PDF
      doc.setFillColor(26, 59, 93);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('Comunicação de Obra', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Edifício Portugal', 105, 23, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      let y = 36;

      // Dados do Morador
      doc.setFontSize(14);
      doc.setFillColor(231, 243, 255);
      doc.rect(14, y - 7, 182, 10, 'F');
      doc.text('Dados do Morador', 16, y);
      y += 8;
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Nome', data.nome_morador],
          ['Apartamento', data.apartamento],
          ['Tipo de Obra', data.tipo_obra],
          ['Início', formatDate(data.data_inicio)],
          ['Término', formatDate(data.data_fim)]
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [44, 92, 138] }
      });
      y = doc.lastAutoTable.finalY + 14;

      // Descrição da Obra
      doc.setFontSize(14);
      doc.setFillColor(231, 243, 255);
      doc.rect(14, y - 7, 182, 10, 'F');
      doc.text('Descrição da Obra', 16, y);
      y += 8;
      doc.autoTable({
        startY: y,
        body: [[data.descricao_obra]],
        theme: 'grid',
        styles: { fontSize: 10, cellWidth: 182 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [44, 92, 138] }
      });
      y = doc.lastAutoTable.finalY + 14;

      // Prestadores
      doc.setFontSize(14);
      doc.setFillColor(231, 243, 255);
      doc.rect(14, y - 7, 182, 10, 'F');
      doc.text('Prestadores de Serviço', 16, y);
      y += 8;
      doc.autoTable({
        startY: y,
        head: [['Nome', 'CPF', 'Função', 'Celular']],
        body: prestadores,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [44, 92, 138] }
      });
      y = doc.lastAutoTable.finalY + 14;

      // Rodapé
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('Gerado em ' + formatDate(new Date().toISOString().slice(0, 10)), 14, 285);
      doc.text('Comunicação de Obra - Edifício Portugal', 105, 285, { align: 'center' });
      doc.text('Página 1', 196, 285, { align: 'right' });

      // Nome do arquivo
      const fileName = `Obra_AP${data.apartamento}_${data.nome_morador.split(' ')[0]}.pdf`;
      doc.save(fileName);

      // Corpo do email
      let corpo = encodeURIComponent(
        `Prezado(a) Administração,\n\n` +
        `Informo o início de obra no apartamento ${data.apartamento}.\n\n` +
        `Detalhes da obra:\n` +
        `Tipo: ${data.tipo_obra}\n` +
        `Início: ${formatDate(data.data_inicio)}\n` +
        `Término previsto: ${formatDate(data.data_fim)}\n\n` +
        `Descrição: ${data.descricao_obra}\n\n` +
        `Prestadores de serviço:\n` +
        prestadores.map(p => `• ${p[0]} (${p[2]}) - CPF: ${p[1]}, Celular: ${p[3]}`).join('\n') +
        `\n\nAtenciosamente,\n${data.nome_morador}`
      );

      const assunto = encodeURIComponent(`Informação sobre início de obra AP ${data.apartamento}`);
      
      // Abrir email
      window.open(`mailto:edportugal85@gmail.com?subject=${assunto}&body=${corpo}`, '_blank');

      // Mensagem
      const mensagem = document.getElementById('mensagem');
      mensagem.innerHTML = `✅ PDF gerado como "${fileName}".<br>Agora você pode anexá-lo ao email que será aberto.`;
      mensagem.className = 'success';
      mensagem.style.display = 'block';
// FIM PDF OBRAS
    });

});

// Templates para itens dinâmicos (podem ser sobrescritos por página)
const templateVeiculo = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  <div class="row">
    <div><label>Marca</label><input type="text" name="veiculo_marca_${i}" required /></div>
    <div><label>Modelo</label><input type="text" name="veiculo_modelo_${i}" required /></div>
    <div><label>Ano</label><input type="number" name="veiculo_ano_${i}" min="1900" max="2030" /></div>
  </div>
  <div class="row">
    <div><label>Cor</label><input type="text" name="veiculo_cor_${i}" required /></div>
    <div><label>Placa</label><input type="text" name="veiculo_placa_${i}" placeholder="ABC-1234" required /></div>
  </div>
`;

const templateContato = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  <div class="row">
    <div><label>Nome</label><input type="text" name="contato_nome_${i}" required /></div>
    <div><label>Parentesco</label><input type="text" name="contato_parentesco_${i}" required /></div>
    <div><label>Celular</label><input type="tel" name="contato_celular_${i}" placeholder="(11) 99999-9999" required /></div>
  </div>
`;

const templateMorador = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  <div class="row">
    <div><label>Nome</label><input type="text" name="morador_nome_${i}" required /></div>
    <div><label>Parentesco</label><input type="text" name="morador_parentesco_${i}" required /></div>
    <div><label>Nascimento</label><input type="date" name="morador_nasc_${i}" required /></div>
  </div>
`;

const templateFuncionario = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  <div class="row">
    <div><label>Nome</label><input type="text" name="funcionario_nome_${i}" required /></div>
    <div><label>Função</label><input type="text" name="funcionario_funcao_${i}" required /></div>
    <div><label>CPF</label><input type="text" name="funcionario_doc_${i}" placeholder="000.000.000-00" required /></div>
  </div>
  <div class="row">
    <div><label>Telefone</label><input type="tel" name="funcionario_tel_${i}" placeholder="(11) 99999-9999" required /></div>
    <div><label>Dias</label><input type="text" name="funcionario_dias_${i}" required /></div>
    <div><label>Horário</label><input type="text" name="funcionario_horario_${i}" required /></div>
  </div>
`;

const templateAnimal = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  <div class="row">
    <div><label>Nome</label><input type="text" name="animal_nome_${i}" required /></div>
    <div><label>Tipo</label><select name="animal_tipo_${i}" required><option value="">Selecione</option><option value="Gato">Gato</option><option value="Cachorro">Cachorro</option></select></div>
    <div><label>Raça</label><input type="text" name="animal_raca_${i}" /></div>
  </div>
`;

const templatePrestador = (i) => `
  <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
  
  <!-- Nome em cima (linha única) -->
  <div style="margin-bottom: 12px;">
    <label>Nome</label>
    <input type="text" name="prestador_nome_${i}" required style="width: 100%; padding: 10px;" />
  </div>
  
  <!-- CPF, Função e Celular lado a lado -->
  <div class="row">
    <div>
      <label>CPF</label>
      <input type="text" name="prestador_cpf_${i}" placeholder="000.000.000-00" required />
    </div>
    <div>
      <label>Função</label>
      <input type="text" name="prestador_funcao_${i}" placeholder="Ex: Eletricista" required />
    </div>
    <div>
      <label>Celular</label>
      <input type="tel" name="prestador_celular_${i}" placeholder="(11) 99999-9999" required />
    </div>
  </div>
`;
//contato emer
let contatoEmergenciaCount = 0;

// Adicionar Contato de Emergência
function addContatoEmergencia() {
  const container = document.getElementById('contatos-emergencia-list');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML = `
    <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
    <div class="row">
      <div>
        <label>Nome</label>
        <input type="text" name="contato_nome_${contatoEmergenciaCount}" required />
      </div>
      <div>
        <label>Grau de parentesco</label>
        <input type="text" name="contato_parentesco_${contatoEmergenciaCount}" required />
      </div>
      <div>
        <label>Celular</label>
        <input type="tel" name="contato_celular_${contatoEmergenciaCount}" placeholder="(11) 99999-9999" required />
      </div>
    </div>
  `;
  container.appendChild(div);
}

// fim contato emer


// normas
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var txt = this.dataset.copy;
      navigator.clipboard && navigator.clipboard.writeText(txt);
      var old = this.innerText;
      this.innerText = 'Copiado!';
      setTimeout(()=> this.innerText = old, 1200);
    });
  
  });

});
// ...mudanca .
document.getElementById('mudancaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  let mensagem = `*Comunicação de Mudança - Edifício Portugal*\n\n`;
  mensagem += `*Nome Morador:* ${formData.get('nome_morador')}\n`;
  mensagem += `*Apartamento:* ${formData.get('apartamento')}\n`;
  mensagem += `*Data:* ${formData.get('data_mudanca')}\n`;
  mensagem += `*Horário:* ${formData.get('hora_mudanca')}\n`;
  

  // Número do WhatsApp do síndico/administrador
  const numero = '5511942560153'; // Substitua pelo número real

  // Monta o link do WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  // Abre o WhatsApp Web
  window.open(url, '_blank');
});
// ...existing code mudança...
