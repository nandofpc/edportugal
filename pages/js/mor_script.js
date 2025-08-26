  
    // Função de validação de CPF
    function validaCPF(cpf) {
      if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) return false;
      return true;
    }

    // Máscara para CPF do morador
    const cpfInput = document.querySelector('input[name="cpf_morador"]');
    if (cpfInput) {
      cpfInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        let out = v;
        if (v.length > 3) out = v.slice(0,3) + '.' + out.slice(3);
        if (v.length > 6) out = out.slice(0,7) + '.' + out.slice(7);
        if (v.length > 9) out = out.slice(0,11) + '-' + out.slice(11);
        e.target.value = out;
      });
      cpfInput.addEventListener('blur', function(e) {
        const cpf = e.target.value.replace(/\D/g, '');
        if (cpf && !validaCPF(cpf)) {
          e.target.setCustomValidity('CPF inválido!');
          e.target.reportValidity();
        } else {
          e.target.setCustomValidity('');
        }
      });
    }

    // Máscara para RG
    const rgInput = document.querySelector('input[name="rg_morador"]');
    if (rgInput) {
      rgInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 9) v = v.slice(0, 9);
        let out = v;
        if (v.length > 2) out = v.slice(0,2) + '.' + out.slice(2);
        if (v.length > 5) out = out.slice(0,6) + '.' + out.slice(6);
        if (v.length > 8) out = out.slice(0,10) + '-' + out.slice(10);
        e.target.value = out;
      });
    }

    // Máscara para celular
    const celularInput = document.querySelector('input[name="celular"]');
    if (celularInput) {
      celularInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        let out = v;
        if (v.length > 0) out = '(' + v.slice(0,2) + ')';
        if (v.length > 2) out += ' ' + v.slice(2,7);
        if (v.length > 7) out += '-' + v.slice(7,11);
        e.target.value = out;
      });
      celularInput.addEventListener('blur', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length !== 11) {
          e.target.setCustomValidity('O celular deve conter 9 dígitos além do DDD.');
          e.target.reportValidity();
        } else {
          e.target.setCustomValidity('');
        }
      });
    }

    // Função para mostrar/ocultar endereço de boleto
    function toggleEnderecoBoleto() {
      const selected = document.querySelector('input[name="receber_boleto"]:checked')?.value;
      const container = document.getElementById('endereco-boleto');
      container.style.display = selected === 'Sim' ? 'block' : 'none';

      // Limpar campos ao ocultar
      if (selected !== 'Sim') {
        document.querySelectorAll('#endereco-boleto input').forEach(inp => {
          if (!inp.hasAttribute('readonly')) inp.value = '';
        });
      }

      // Atualizar validações
      validarEnderecoBoleto();
    }

    // Validar se o endereço de boleto é obrigatório
    function validarEnderecoBoleto() {
      const selected = document.querySelector('input[name="receber_boleto"]:checked')?.value;
      const cep = document.getElementById('boleto_cep');
      const numero = document.getElementById('boleto_numero');

      if (selected === 'Sim') {
        cep.setAttribute('required', 'required');
        numero.setAttribute('required', 'required');
      } else {
        cep.removeAttribute('required');
        numero.removeAttribute('required');
      }
    }

    // Máscara de CEP
    document.getElementById('boleto_cep').addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 8) v = v.slice(0, 8);
      if (v.length > 5) {
        e.target.value = v.slice(0,5) + '-' + v.slice(5);
      } else {
        e.target.value = v;
      }
    });

    // Busca de endereço por CEP
    document.getElementById('boleto_cep').addEventListener('blur', function(e) {
      const cep = e.target.value.replace(/\D/g, '');
      if (cep.length !== 8) return;

      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            document.getElementById('boleto_logradouro').value = data.logradouro;
            document.getElementById('boleto_bairro').value = data.bairro;
            document.getElementById('boleto_cidade').value = data.localidade;
            document.getElementById('boleto_uf').value = data.uf;
          } else {
            alert('CEP não encontrado.');
            limparCamposEndereco();
          }
        })
        .catch(err => {
          console.error('Erro ao buscar CEP:', err);
          alert('Erro ao buscar o CEP. Verifique a conexão.');
        });
    });

    function limparCamposEndereco() {
      document.getElementById('boleto_logradouro').value = '';
      document.getElementById('boleto_bairro').value = '';
      document.getElementById('boleto_cidade').value = '';
      document.getElementById('boleto_uf').value = '';
    }

    // Contadores globais
    let veiculoCount = 0;
    let moradorCount = 0;
    let funcionarioCount = 0;
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
      const novoCelular = div.querySelector(`input[name="contato_celular_${contatoEmergenciaCount}"]`);
      novoCelular.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        let out = v;
        if (v.length > 0) out = '(' + v.slice(0,2) + ')';
        if (v.length > 2) out += ' ' + v.slice(2,7);
        if (v.length > 7) out += '-' + v.slice(7,11);
        e.target.value = out;
      });
      contatoEmergenciaCount++;
    }

    // Adicionar Morador
    function addMorador() {
      const container = document.getElementById('moradores-list');
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.innerHTML = `
        <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
        <div class="row">
          <div>
            <label>Nome</label>
            <input type="text" name="morador_nome_${moradorCount}" required />
          </div>
          <div>
            <label>Parentesco</label>
            <input type="text" name="morador_parentesco_${moradorCount}" required />
          </div>
          <div>
            <label>Data de Nascimento</label>
            <input type="date" name="morador_nasc_${moradorCount}" required />
          </div>
        </div>
      `;
      container.appendChild(div);
      moradorCount++;
    }

    // Adicionar Funcionário
    function addFuncionario() {
      const container = document.getElementById('funcionarios-list');
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.innerHTML = `
        <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
        <div class="row">
          <div>
            <label>Nome</label>
            <input type="text" name="funcionario_nome_${funcionarioCount}" required />
          </div>
          <div>
            <label>Função</label>
            <input type="text" name="funcionario_funcao_${funcionarioCount}" required />
          </div>
          <div>
            <label>CPF</label>
            <input type="text" name="funcionario_doc_${funcionarioCount}" placeholder="000.000.000-00" required />
          </div>
        </div>
        <div class="row">
          <div>
            <label>Telefone</label>
            <input type="tel" name="funcionario_tel_${funcionarioCount}" placeholder="(11) 99999-9999" required />
          </div>
          <div>
            <label>Dias de trabalho</label>
            <input type="text" name="funcionario_dias_${funcionarioCount}" placeholder="Ex: Seg, Qua, Sex" required />
          </div>
          <div>
            <label>Horário</label>
            <input type="text" name="funcionario_horario_${funcionarioCount}" placeholder="Ex: 8h às 17h" required />
          </div>
        </div>
      `;
      container.appendChild(div);

      // Máscara e validação de CPF do funcionário
      const cpfFunc = div.querySelector(`input[name="funcionario_doc_${funcionarioCount}"]`);
      cpfFunc.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        let out = v;
        if (v.length > 3) out = v.slice(0,3) + '.' + out.slice(3);
        if (v.length > 6) out = out.slice(0,7) + '.' + out.slice(7);
        if (v.length > 9) out = out.slice(0,11) + '-' + out.slice(11);
        e.target.value = out;
      });
      cpfFunc.addEventListener('blur', function(e) {
        const cpf = e.target.value.replace(/\D/g, '');
        if (cpf && !validaCPF(cpf)) {
          e.target.setCustomValidity('CPF inválido!');
          e.target.reportValidity();
        } else {
          e.target.setCustomValidity('');
        }
      });

      // Máscara para telefone
      const telFunc = div.querySelector(`input[name="funcionario_tel_${funcionarioCount}"]`);
      telFunc.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        let out = v;
        if (v.length > 0) out = '(' + v.slice(0,2) + ')';
        if (v.length > 2) out += ' ' + v.slice(2,7);
        if (v.length > 7) out += '-' + v.slice(7,11);
        e.target.value = out;
      });

      funcionarioCount++;
    }

    // Animais
    window.animalCount = 0;
    window.addAnimal = function addAnimal() {
      const container = document.getElementById('animais-list');
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.style.marginBottom = '10px';
      div.innerHTML = `
        <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
        <div class="row">
          <div>
            <label>Nome</label>
            <input type="text" name="animal_nome_${window.animalCount}" placeholder="Nome do animal" required />
          </div>
          <div>
            <label>Tipo</label>
            <select name="animal_tipo_${window.animalCount}" required>
              <option value="">Selecione</option>
              <option value="Gato">Gato</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Pássaro">Pássaro</option>
              <option value="Roedor">Roedor</option>
              <option value="Réptil">Réptil</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div>
            <label>Raça</label>
            <input type="text" name="animal_raca_${window.animalCount}" placeholder="Raça" />
          </div>
        </div>
        <div class="row">
          <div>
            <label>Cor</label>
            <input type="text" name="animal_cor_${window.animalCount}" placeholder="Cor" />
          </div>
          <div>
            <label>Peso (kg)</label>
            <input type="number" name="animal_peso_${window.animalCount}" step="0.1" placeholder="Peso em kg" />
          </div>
          <div>
            <label>Vacinas em dia?</label>
            <select name="animal_vacinas_${window.animalCount}">
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
        </div>
      `;
      container.appendChild(div);
      window.animalCount++;
    };

    function toggleAnimais() {
      const selected = document.querySelector('input[name="animais"]:checked')?.value;
      document.getElementById('animais-info').style.display = selected === 'Sim' ? 'block' : 'none';
      if (selected !== 'Sim') {
        document.getElementById('animais-list').innerHTML = '';
        window.animalCount = 0;
      } else if (document.getElementById('animais-list').children.length === 0) {
        addAnimal();
      }
    }

    // Gerar PDF
    const formEl = document.getElementById('moradorForm');
  formEl.addEventListener('submit', function(e) {
  e.preventDefault();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const formData = new FormData(this);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Função para converter imagem em base64
  function getBase64Image(url, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
    };
    img.onerror = function() {
      callback(null);
    };
    img.src = url;
  }

  // Geração do PDF com logo
  getBase64Image('images/logo-22-ot.jpg', function(base64) {
    // Cabeçalho do PDF com logo
    doc.setFillColor(26, 59, 93);
    doc.rect(0, 0, 210, 28, 'F');
    if (base64) {
      doc.addImage(base64, 'PNG', 14, 4, 20, 20);
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Cadastro de Morador', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Edifício Portugal', 105, 23, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    let y = 36;
  });
    // ...restante do seu código de geração do PDF (dados pessoais, tabelas, rodapé etc.)...
    // Copie todo o conteúdo que estava dentro do submit para dentro deste callback!

    // Exemplo de finalização:
    // doc.save(fileName);
    // mensagem.innerHTML = ...;
    // mensagem.className = ...;
    // mensagem.style.display = ...;
  

      // Validar convênio médico
     // if (!data.convenio_medico || data.convenio_medico.trim() === '') {
     //   alert('O campo de convênio médico é obrigatório.');
     //   document.querySelector('input[name="convenio_medico"]').focus();
     //   return;
     // }

      // Validar contato de emergência
      const contatosEmergencia = [];
      for (let i = 0; i < contatoEmergenciaCount; i++) {
        const nome = data[`contato_nome_${i}`];
        const parentesco = data[`contato_parentesco_${i}`];
        const celular = data[`contato_celular_${i}`];
        if (nome && parentesco && celular) {
          contatosEmergencia.push([nome, parentesco, celular]);
        }
      }
      if (contatosEmergencia.length === 0) {
        alert('É obrigatório informar pelo menos um contato de emergência.');
        addContatoEmergencia();
        return;
      }

      // Animais
      const animais = [];
      for (let i = 0; i < window.animalCount; i++) {
        const nome = data[`animal_nome_${i}`];
        const tipo = data[`animal_tipo_${i}`];
        const raca = data[`animal_raca_${i}`];
        const cor = data[`animal_cor_${i}`];
        const peso = data[`animal_peso_${i}`];
        const vacinas = data[`animal_vacinas_${i}`];
        if (nome && tipo) {
          animais.push([nome, tipo, raca || '-', cor || '-', peso || '-', vacinas || '-']);
        }
      }

      // Veículos
      const veiculos = [];
      for (let i = 0; i < veiculoCount; i++) {
        const marca = data[`veiculo_marca_${i}`];
        const modelo = data[`veiculo_modelo_${i}`];
        const ano = data[`veiculo_ano_${i}`];
        const cor = data[`veiculo_cor_${i}`];
        const placa = data[`veiculo_placa_${i}`];
        if (marca && modelo && placa) {
          veiculos.push([marca, modelo, ano || '-', cor || '-', placa]);
        }
      }

      // Cabeçalho do PDF
      doc.setFillColor(26, 59, 93);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('Cadastro de Morador', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Edifício Portugal', 105, 23, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      let y = 36;

      // Dados Pessoais
      doc.setFontSize(14);
      doc.setFillColor(231, 243, 255);
      doc.rect(14, y - 7, 182, 10, 'F');
      doc.text('Dados Pessoais', 16, y);
      y += 8;
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Nome', data.nome_morador],
          ['CPF', data.cpf_morador],
          ['RG', data.rg_morador || 'Não informado'],
          ['Nascimento', formatDate(data.nascimento_morador)],
          ['Estado civil', data.estado_civil],
          ['Profissão', data.profissao],
          ['Apartamento', data.apartamento],
          ['Celular', data.celular],
          ['Email', data.email]
        ],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [44, 92, 138] }
      });
      y = doc.lastAutoTable.finalY + 14;

      // Endereço de Boleto (se aplicável)
      if (data.receber_boleto === 'Sim' && data.boleto_cep) {
        const enderecoBoleto = [
          ['CEP', data.boleto_cep],
          ['Logradouro', `${data.boleto_logradouro}, ${data.boleto_numero}`],
          ['Complemento', data.boleto_complemento || '-'],
          ['Bairro', data.boleto_bairro],
          ['Cidade / UF', `${data.boleto_cidade} / ${data.boleto_uf}`]
        ];
        doc.setFontSize(14);
        doc.setFillColor(231, 243, 255);
        doc.rect(14, y - 7, 182, 10, 'F');
        doc.text('Endereço de Recebimento do Boleto', 16, y);
        y += 8;
        doc.autoTable({
          startY: y,
          head: [['Campo', 'Valor']],
          body: enderecoBoleto,
          theme: 'grid',
          styles: { fontSize: 10 },
          margin: { left: 14, right: 14 },
          headStyles: { fillColor: [44, 92, 138] }
        });
        y = doc.lastAutoTable.finalY + 14;
      }

      // Convênio Médico
      doc.setFontSize(14);
      doc.setFillColor(231, 243, 255);
      doc.rect(14, y - 7, 182, 10, 'F');
      doc.text('Convênio Médico', 16, y);
      y += 8;
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [['Convênio Médico', data.convenio_medico]],
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [44, 92, 138] }
      });
      y = doc.lastAutoTable.finalY + 14;

      // Veículos
if (veiculos.length > 0) {
  doc.setFontSize(14);
  doc.setFillColor(231, 243, 255);
  doc.rect(14, y - 7, 182, 10, 'F');
  doc.text('Veículo(s)', 16, y);
  y += 8;
  doc.autoTable({
    startY: y,
    head: [['Marca', 'Modelo', 'Ano', 'Cor', 'Placa']],
    body: veiculos,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [44, 92, 138] }
  });
  y = doc.lastAutoTable.finalY + 14;
}

// Contatos de Emergência
if (contatosEmergencia.length > 0) {
  doc.setFontSize(14);
  doc.setFillColor(231, 243, 255);
  doc.rect(14, y - 7, 182, 10, 'F');
  doc.text('Contato(s) de Emergência', 16, y);
  y += 8;
  doc.autoTable({
    startY: y,
    head: [['Nome', 'Parentesco', 'Celular']],
    body: contatosEmergencia,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [44, 92, 138] }
  });
  y = doc.lastAutoTable.finalY + 14;
}

// Outros Moradores
const outrosMoradores = [];
for (let i = 0; i < moradorCount; i++) {
  const nome = data[`morador_nome_${i}`];
  const parentesco = data[`morador_parentesco_${i}`];
  const nasc = data[`morador_nasc_${i}`];
  if (nome && parentesco) {
    outrosMoradores.push([nome, parentesco, nasc ? formatDate(nasc) : '-']);
  }
}
if (outrosMoradores.length > 0) {
  doc.setFontSize(14);
  doc.setFillColor(231, 243, 255);
  doc.rect(14, y - 7, 182, 10, 'F');
  doc.text('Outros Moradores da Unidade', 16, y);
  y += 8;
  doc.autoTable({
    startY: y,
    head: [['Nome', 'Parentesco', 'Nascimento']],
    body: outrosMoradores,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [44, 92, 138] }
  });
  y = doc.lastAutoTable.finalY + 14;
}

// Funcionários Domésticos
const funcionarios = [];
for (let i = 0; i < funcionarioCount; i++) {
  const nome = data[`funcionario_nome_${i}`];
  const funcao = data[`funcionario_funcao_${i}`];
  const cpf = data[`funcionario_doc_${i}`];
  const tel = data[`funcionario_tel_${i}`];
  const dias = data[`funcionario_dias_${i}`];
  const horario = data[`funcionario_horario_${i}`];
  if (nome && funcao) {
    funcionarios.push([nome, funcao, cpf || '-', tel || '-', dias || '-', horario || '-']);
  }
}
if (funcionarios.length > 0) {
  doc.setFontSize(14);
  doc.setFillColor(231, 243, 255);
  doc.rect(14, y - 7, 182, 10, 'F');
  doc.text('Funcionários Domésticos', 16, y);
  y += 8;
  doc.autoTable({
    startY: y,
    head: [['Nome', 'Função', 'CPF', 'Telefone', 'Dias', 'Horário']],
    body: funcionarios,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [44, 92, 138] }
  });
  y = doc.lastAutoTable.finalY + 14;
}

// Animais
if (animais.length > 0) {
  doc.setFontSize(14);
  doc.setFillColor(231, 243, 255);
  doc.rect(14, y - 7, 182, 10, 'F');
  doc.text('Animais Domésticos', 16, y);
  y += 8;
  doc.autoTable({
    startY: y,
    head: [['Nome', 'Tipo', 'Raça', 'Cor', 'Peso', 'Vacinas em dia']],
    body: animais,
    theme: 'grid',
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
    headStyles: { fillColor: [44, 92, 138] }
  });
  y = doc.lastAutoTable.finalY + 14;
}

// Outras Informações
doc.setFontSize(14);
doc.setFillColor(231, 243, 255);
doc.rect(14, y - 7, 182, 10, 'F');
doc.text('Outras Informações', 16, y);
y += 8;
doc.autoTable({
  startY: y,
  head: [['Campo', 'Valor']],
  body: [
    ['Nº de Bicicletas', data.bicicletas || '0'],
    ['Observações', data.observacoes || '-']
  ],
  theme: 'grid',
  styles: { fontSize: 10 },
  margin: { left: 14, right: 14 },
  headStyles: { fillColor: [44, 92, 138] }
});
y = doc.lastAutoTable.finalY + 14;
      // Veículos, Contatos, Moradores, Funcionários, Animais, Observações... (restante igual)

      // [Blocos restantes mantidos conforme original]

      // Rodapé
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('Gerado em ' + formatDate(new Date().toISOString().slice(0, 10)), 14, 285);
      doc.text('Cadastro de Morador - Edifício Portugal', 105, 285, { align: 'center' });
      doc.text('Página 1', 196, 285, { align: 'right' });
      doc.setTextColor(0, 0, 0);

      // Salvar PDF
      const fileName = `Cadastro_Morador_${data.apartamento}_${data.nome_morador.split(' ')[0]}.pdf`;
      doc.save(fileName);

      // Mensagem
      const mensagem = document.getElementById('mensagem');
      mensagem.innerHTML = `✅ Cadastro salvo como "${fileName}".<br>O PDF foi gerado com todas as informações do morador.`;
      mensagem.className = 'success';
      mensagem.style.display = 'block';
    });

    // Função auxiliar: formatar data
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }

    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
      addContatoEmergencia();
      validarEnderecoBoleto(); // Inicializa validação
    });
// Lista de modelos por marca
const modelosPorMarca = {
  Fiat: ["Uno", "Palio", "Argo", "Mobi", "Toro", "Strada", "500", "Pulse", "Cronos"],
  Volkswagen: ["Gol", "Polo", "Voyage", "Fox", "Saveiro", "T-Cross", "Nivus", "Amarok", "Taos", "Jetta"],
  Chevrolet: ["Onix", "Prisma", "Cobalt", "Tracker", "S10", "Spin", "Equinox", "Blazer", "Trailblazer"],
  Ford: ["Ka", "EcoSport", "Fusion", "Ranger", "Edge", "Focus", "Fiesta", "Escape"],
  Honda: ["Civic", "City", "HR-V", "Fit", "Accord", "CR-V", "WR-V"],
  Toyota: ["Corolla", "Etios", "Yaris", "Hilux", "SW4", "RAV4", "Yaris Sedan", "Prius"],
  Hyundai: ["HB20", "Creta", "ix35", "Azera", "Tucson", "Elantra", "Venue"],
  Renault: ["Kwid", "Logan", "Sandero", "Duster", "Captur", "Alaskan", "Fluence"],
  Nissan: ["March", "Versa", "Kicks", "Frontier", "Sentra", "Leaf", "X-Trail"],
  Peugeot: ["208", "2008", "308", "508", "Partner", "3008", "5008"],
  Jeep: ["Renegade", "Compass", "Wrangler", "Gladiator", "Grand Cherokee"],
  Mitsubishi: ["Pajero", "Outlander", "ASX", "L200", "Triton"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLA", "GLC", "S-Class", "Vito"],
  BMW: ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "i3", "i8"],
  Audi: ["A1", "A3", "A4", "Q3", "Q5", "Q7", "TT", "e-tron"],
  Volvo: ["XC40", "XC60", "XC90", "S60", "S90"]
};

// Atualiza os modelos sugeridos com base na marca
document.getElementById('veiculo_marca').addEventListener('input', function () {
  const marca = this.value;
  const modeloInput = document.getElementById('veiculo_modelo');
  const datalist = document.getElementById('modelos');
  datalist.innerHTML = ''; // Limpa opções anteriores

  if (marca && modelosPorMarca[marca]) {
    modelosPorMarca[marca].forEach(modelo => {
      const option = document.createElement('option');
      option.value = modelo;
      datalist.appendChild(option);
    });
  }
});

// Atualiza os modelos com base na marca selecionada
document.getElementById('veiculo_marca').addEventListener('change', function () {
  const marca = this.value;
  const modeloSelect = document.getElementById('veiculo_modelo');
  modeloSelect.innerHTML = '<option value="">Selecione o modelo</option>';
  
  if (marca && modelosPorMarca[marca]) {
    modelosPorMarca[marca].forEach(modelo => {
      const option = document.createElement('option');
      option.value = modelo;
      option.textContent = modelo;
      modeloSelect.appendChild(option);
    });
  }
});  
