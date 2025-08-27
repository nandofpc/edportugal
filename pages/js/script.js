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

// mudança
// Função para formatar data (ex: 01/01/2025)
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Enviar formulário
const formEl = document.getElementById('mudancaForm');
const mensagemEl = document.getElementById('mensagem');
const dataInput = document.getElementById('data_mudanca');

// Calcular data mínima: hoje + 3 dias
const hoje = new Date();
const minDate = new Date(hoje);
minDate.setDate(hoje.getDate() + 3);

// Formatar para o padrão YYYY-MM-DD (usado no input date)
const minDateString = minDate.toISOString().split('T')[0];

// Aplicar data mínima no campo
dataInput.setAttribute('min', minDateString);

// Mensagem de ajuda (opcional)
const infoData = document.createElement('p');
infoData.style.fontSize = '0.9em';
infoData.style.color = '#555';
infoData.style.marginTop = '5px';
infoData.innerHTML = `<strong>Informação:</strong> A mudança deve ser agendada com no mínimo 3 dias de antecedência.`;
document.querySelector('label[for="data_mudanca"]')?.parentElement.appendChild(infoData);

formEl.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Validação
  if (!data.nome_morador || !data.apartamento || !data.data_mudanca || !data.hora_mudanca) {
    mensagemEl.innerHTML = '⚠️ Por favor, preencha todos os campos.';
    mensagemEl.className = 'error';
    mensagemEl.style.display = 'block';
    return;
  }

  // Validar data da mudança (mínimo: hoje + 3 dias)
  const dataSelecionada = new Date(data.data_mudanca);
  if (dataSelecionada < minDate) {
    mensagemEl.innerHTML = `⚠️ A data da mudança deve ser a partir de <strong>${formatDate(minDateString)}</strong>.`;
    mensagemEl.className = 'error';
    mensagemEl.style.display = 'block';
    return;
  }

  // Tudo ok! Gerar mensagem do WhatsApp
  const mensagem = encodeURIComponent(
    `*SOLICITAÇÃO DE AGENDAMENTO DE MUDANÇA*\n\n` +
    `📌 *Morador:* ${data.nome_morador}\n` +
    `🏠 *Apartamento:* ${data.apartamento}\n` +
    `📅 *Data:* ${formatDate(data.data_mudanca)}\n` +
    `⏰ *Horário:* ${data.hora_mudanca}\n\n` +
    `Por favor, confirme a disponibilidade do elevador e do hall social.`
  );

  // Número do síndico (substitua pelo número real)
  const numeroSindico = '5511999998888'; // Ex: 55 + DDD + número
  const url = `https://wa.me/${numeroSindico}?text=${mensagem}`;

  // Abrir WhatsApp
  window.open(url, '_blank');

  // Mensagem de sucesso
  mensagemEl.innerHTML = `✅ Solicitação enviada com sucesso!<br>Abra o WhatsApp para confirmar o envio.`;
  mensagemEl.className = 'success';
  mensagemEl.style.display = 'block';
});
// fim mudança

// corretores
    // Contador de corretores
    let corretorCount = 0;

    // Adicionar Corretor
    function addCorretor() {
    const container = document.getElementById('corretores-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
        <div>
        <label>Nome completo</label>
        <input type="text" name="corretor_nome_${corretorCount}" required />
        </div>
        <div class="row">
        <div>
            <label>CRECI</label>
            <input type="text" name="corretor_creci_${corretorCount}" placeholder="SP-12345" required />
        </div>
        <div>
            <label>Dias de visita permitidos</label>
            <select name="corretor_dias_${corretorCount}" required>
            <option value="">Selecione</option>
            <option value="Segunda a Sexta">Segunda a Sexta</option>
            <option value="Segunda a Sábado">Segunda a Sábado</option>
            </select>
        </div>
        </div>
    `;
    container.appendChild(div);
    corretorCount++;
    }

    // Adicionar primeiro corretor automaticamente
    document.addEventListener('DOMContentLoaded', function() {
      addCorretor();
    });

    // Enviar formulário
   

    formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Validar dados do proprietário
      if (!data.nome_proprietario || !data.apartamento) {
        mensagemEl.innerHTML = '⚠️ Por favor, preencha todos os dados do proprietário.';
        mensagemEl.className = 'error';
        mensagemEl.style.display = 'block';
        return;
      }

      // Coletar corretores
      const corretores = [];
      for (let i = 0; i < corretorCount; i++) {
        const nome = data[`corretor_nome_${i}`];
        const creci = data[`corretor_creci_${i}`];
        const dias = data[`corretor_dias_${i}`];
        if (nome && creci && dias) {
          corretores.push({ nome, creci, dias });
        }
      }

      if (corretores.length === 0) {
        mensagemEl.innerHTML = '⚠️ Adicione pelo menos um corretor.';
        mensagemEl.className = 'error';
        mensagemEl.style.display = 'block';
        return;
      }

      // Gerar e-mail em HTML
      const assunto = encodeURIComponent(`Autorização de Corretores - Apartamento ${data.apartamento}`);
      const corpoHTML = `
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #1a3b5d, #2c5c8a); color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Autorização de Corretores</h2>
              <p style="margin: 5px 0 0; opacity: 0.9;">Edifício Portugal</p>
            </div>
            <div style="padding: 20px;">
              <p><strong>Proprietário:</strong> ${data.nome_proprietario}</p>
              <p><strong>Apartamento:</strong> ${data.apartamento}</p>
              <p><strong>Horário permitido:</strong> 08:00 às 18:00</p>
              <h3 style="color: #1a3b5d; border-bottom: 1px solid #eee; padding-bottom: 5px;">Corretores Autorizados</h3>
              <table width="100%" style="border-collapse: collapse; margin: 15px 0;">
                <tr style="background-color: #f0f4f8; font-weight: bold;">
                  <td style="padding: 8px; border: 1px solid #ddd;">Nome</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">CRECI</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">Dias Permitidos</td>
                </tr>
                ${corretores.map(c => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${c.nome}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${c.creci}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${c.dias}</td>
                </tr>
                `).join('')}
              </table>
              <p><em>Este cadastro autoriza os corretores listados a agendar visitas ao imóvel dentro do horário permitido.</em></p>
            </div>
            <div style="background: #f9f9fb; padding: 15px; text-align: center; font-size: 0.9em; color: #666; border-top: 1px solid #eee;">
              Edifício Portugal &copy; ${new Date().getFullYear()}
            </div>
          </div>
        </body>
        </html>
      `.replace(/\s+/g, ' ').trim();

      const corpoTexto = `
        AUTORIZAÇÃO DE CORRETORES - Edifício Portugal

        Proprietário: ${data.nome_proprietario}
        Apartamento: ${data.apartamento}
        Horário permitido: 08:00 às 18:00

        Corretores Autorizados:
        ${corretores.map(c => `- ${c.nome} (CRECI: ${c.creci}) - ${c.dias}`).join('\n')}

        Este cadastro autoriza os corretores listados a agendar visitas ao imóvel dentro do horário permitido.

        Edifício Portugal © ${new Date().getFullYear()}
      `.trim();

      // Codificar para mailto
      const mailtoLink = `mailto:edportugal85@gmail.com?subject=${assunto}&body=${encodeURIComponent(corpoTexto)}&html=${encodeURIComponent(corpoHTML)}`;

      // Abrir e-mail
      window.location.href = mailtoLink;

      // Mensagem de sucesso
      mensagemEl.innerHTML = `✅ E-mail aberto com sucesso!<br>Confirme o envio no seu cliente de e-mail.`;
      mensagemEl.className = 'success';
      mensagemEl.style.display = 'block';
    });
// fim corretores