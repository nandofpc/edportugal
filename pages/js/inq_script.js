
    // Máscara para CPF
    const cpfInput = document.querySelector('input[name="cpf_inquilino"]');
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
    
    // Máscara para celular
    const celularInput = document.querySelector('input[name="celular"]');
    if (celularInput) {
      celularInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        // DDD (2) + 9 dígitos (9)
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
    
    // Máscara para telefone da administradora (fixo)
    const telAdmInput = document.querySelector('input[name="tel_adm"]');
    if (telAdmInput) {
      telAdmInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        // DDD (2) + 8 dígitos
        if (v.length > 10) v = v.slice(0, 10);
        let out = v;
        if (v.length > 0) out = '(' + v.slice(0,2) + ')';
        if (v.length > 2) out += ' ' + v.slice(2,6);
        if (v.length > 6) out += '-' + v.slice(6,10);
        e.target.value = out;
      });
    }
    
    // Contadores globais
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
      
      // Adicionar máscara para o campo de celular do contato de emergência
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
      
      // Adicionar um contato de emergência inicial automaticamente se for o primeiro
      if (contatoEmergenciaCount === 1) {
        addContatoEmergencia();
      }
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
      `;
      container.appendChild(div);
      funcionarioCount++;
    }
    
    // Mostrar/ocultar campo de animais
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
            <input type="text" name="animal_nome_${window.animalCount}" placeholder="Nome do animal" />
          </div>
          <div>
            <label>Tipo</label>
            <select name="animal_tipo_${window.animalCount}">
              <option value="">Selecione</option>
              <option value="Gato">Gato</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div>
            <label>Raça</label>
            <input type="text" name="animal_raca_${window.animalCount}" placeholder="Raça" />
          </div>
          <div>
            <label>Cor</label>
            <input type="text" name="animal_cor_${window.animalCount}" placeholder="Cor" />
          </div>
        </div>
      `;
      container.appendChild(div);
      window.animalCount++;
    }
    
    function toggleAnimais() {
      const selected = document.querySelector('input[name="animais"]:checked')?.value;
      document.getElementById('animais-info').style.display = selected === 'Sim' ? 'block' : 'none';
      // Limpa lista se marcar Não
      if(selected !== 'Sim') {
        document.getElementById('animais-list').innerHTML = '';
        window.animalCount = 0;
      } else if(document.getElementById('animais-list').children.length === 0) {
        addAnimal();
      }
    }
    
    // Modernizar PDF
    const formEl = document.getElementById('aluguelForm');
    formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const formData = new FormData(this);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Validar convênio médico
      // if (!data.convenio_medico || data.convenio_medico.trim() === '') {
      //  alert('O campo de convênio médico é obrigatório.');
      //  document.querySelector('input[name="convenio_medico"]').focus();
      //  return;
     // }
      
      // Validar contato de emergência
      const contatosEmergencia = [];
      for(let i=0; i<contatoEmergenciaCount; i++) {
        const nome = data[`contato_nome_${i}`];
        const parentesco = data[`contato_parentesco_${i}`];
        const celular = data[`contato_celular_${i}`];
        if(nome && parentesco && celular) {
          contatosEmergencia.push([nome, parentesco, celular]);
        }
      }
      
      if (contatosEmergencia.length === 0) {
        alert('É obrigatório informar pelo menos um contato de emergência.');
        addContatoEmergencia(); // Adiciona um contato se não houver nenhum
        return;
      }
      
      // Animais: montar lista
      const animais = [];
      for(let i=0; i<animalCount; i++) {
        const nome = data[`animal_nome_${i}`];
        const tipo = data[`animal_tipo_${i}`];
        const raca = data[`animal_raca_${i}`];
        const cor = data[`animal_cor_${i}`];
        if(nome || tipo || raca || cor) {
          animais.push([nome||'-', tipo||'-', raca||'-', cor||'-']);
        }
      }
      
      // Cabeçalho visual
      doc.setFillColor(26, 59, 93);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255,255,255);
      doc.setFontSize(20);
      doc.text('Cadastro de Locação', 105, 15, {align:'center'});
      doc.setFontSize(12);
      doc.text('Edifício Portugal', 105, 23, {align:'center'});
      doc.setTextColor(0,0,0);
      let y = 36;
      
      // Bloco: Dados do Inquilino
      doc.setFontSize(14);
      doc.setDrawColor(44,92,138);
      doc.setFillColor(231,243,255);
      doc.rect(14, y-7, 182, 10, 'F');
      doc.text('Dados do Inquilino', 16, y);
      y += 8;
      doc.setFontSize(11);
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Nome', data.nome_inquilino],
          ['CPF', data.cpf_inquilino],
          ['Nascimento', formatDate(data.nascimento_inquilino)],
          ['Apartamento', data.apartamento],
          ['Tempo de locação', data.tempo_locacao + ' meses'],
          ['Início da locação', formatDate(data.inicio_locacao)],
          ['Celular', data.celular],
          ['Email', data.email]
        ],
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:14, right:14},
        headStyles: {fillColor: [44,92,138]},
      });
      y = doc.lastAutoTable.finalY + 14; // Espaço extra
      
      // Bloco: Contatos da Administradora
      doc.setFontSize(14);
      doc.setFillColor(231,243,255);
      doc.rect(14, y-7, 182, 10, 'F');
      doc.text('Contatos da Administradora', 16, y);
      y += 8;
      doc.setFontSize(11);
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Administradora', data.nome_adm],
          ['Corretor', data.nome_corretor],
          ['Telefone', data.tel_adm],
          ['Email', data.email_adm]
        ],
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:14, right:14},
        headStyles: {fillColor: [44,92,138]},
      });
      y = doc.lastAutoTable.finalY + 14; // Espaço extra
      
      // Bloco: Convênio Médico
      doc.setFontSize(14);
      doc.setFillColor(231,243,255);
      doc.rect(14, y-7, 182, 10, 'F');
      doc.text('Convênio Médico', 16, y);
      y += 8;
      doc.setFontSize(11);
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Convênio Médico', data.convenio_medico]
        ],
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:14, right:14},
        headStyles: {fillColor: [44,92,138]},
      });
      y = doc.lastAutoTable.finalY + 14; // Espaço extra
      
      // Bloco: Veículo (apenas um)
      if (data.veiculo_marca && data.veiculo_modelo && data.veiculo_placa) {
        doc.setFontSize(14);
        doc.setFillColor(231,243,255);
        doc.rect(14, y-7, 182, 10, 'F');
        doc.text('Veículo', 16, y);
        y += 8;
        doc.autoTable({
          startY: y,
          head: [['Marca', 'Modelo', 'Placa']],
          body: [[data.veiculo_marca, data.veiculo_modelo, data.veiculo_placa]],
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:14, right:14},
          headStyles: {fillColor: [44,92,138]},
        });
        y = doc.lastAutoTable.finalY + 14;
      }
      
      // Bloco: Contatos de Emergência
      if (contatosEmergencia.length > 0) {
        doc.setFontSize(14);
        doc.setFillColor(231,243,255);
        doc.rect(14, y-7, 182, 10, 'F');
        doc.text('Contatos de Emergência', 16, y);
        y += 8;
        doc.autoTable({
          startY: y,
          head: [['Nome', 'Parentesco', 'Celular']],
          body: contatosEmergencia,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:14, right:14},
          headStyles: {fillColor: [44,92,138]},
        });
        y = doc.lastAutoTable.finalY + 14; // Espaço extra
      }
      
      // Bloco: Outros Moradores
      const moradores = [];
      for (let i = 0; i < moradorCount; i++) {
        const nome = data[`morador_nome_${i}`];
        const parentesco = data[`morador_parentesco_${i}`];
        const nasc = formatDate(data[`morador_nasc_${i}`]);
        if (nome && parentesco && nasc) {
          moradores.push([nome, parentesco, nasc]);
        }
      }
      if (moradores.length > 0) {
        doc.setFontSize(14);
        doc.setFillColor(231,243,255);
        doc.rect(14, y-7, 182, 10, 'F');
        doc.text('Outros Moradores', 16, y);
        y += 8;
        doc.autoTable({
          startY: y,
          head: [['Nome', 'Parentesco', 'Nascimento']],
          body: moradores,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:14, right:14},
          headStyles: {fillColor: [44,92,138]},
        });
        y = doc.lastAutoTable.finalY + 14; // Espaço extra
      }
      
      // Bloco: Funcionários Domésticos
      const funcionarios = [];
      for (let i = 0; i < funcionarioCount; i++) {
        const nome = data[`funcionario_nome_${i}`];
        const funcao = data[`funcionario_funcao_${i}`];
        const docFunc = data[`funcionario_doc_${i}`];
        if (nome && funcao && docFunc) {
          funcionarios.push([nome, funcao, docFunc]);
        }
      }
      if (funcionarios.length > 0) {
        doc.setFontSize(14);
        doc.setFillColor(231,243,255);
        doc.rect(14, y-7, 182, 10, 'F');
        doc.text('Funcionários Domésticos', 16, y);
        y += 8;
        doc.autoTable({
          startY: y,
          head: [['Nome', 'Função', 'RG/CPF']],
          body: funcionarios,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:14, right:14},
          headStyles: {fillColor: [44,92,138]},
        });
        y = doc.lastAutoTable.finalY + 14; // Espaço extra
      }
      
      // Bloco: Outras Informações
      doc.setFontSize(14);
      doc.setFillColor(231,243,255);
      doc.rect(14, y-7, 182, 10, 'F');
      doc.text('Outras Informações', 16, y);
      y += 8;
      doc.setFontSize(11);
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: [
          ['Bicicletas', data.bicicletas || 0],
          ['Animais', data.animais || 'Não']
        ],
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:14, right:14},
        headStyles: {fillColor: [44,92,138]},
      });
      y = doc.lastAutoTable.finalY + 4;
      if(data.animais === 'Sim' && animais.length > 0) {
        doc.autoTable({
          startY: y,
          head: [['Nome', 'Tipo', 'Raça', 'Cor']],
          body: animais,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:14, right:14},
          headStyles: {fillColor: [44,92,138]},
        });
        y = doc.lastAutoTable.finalY + 10;
      }
      
      // Rodapé
      doc.setFontSize(10);
      doc.setTextColor(120,120,120);
      doc.text('Gerado em ' + formatDate(new Date().toISOString().slice(0,10)), 14, 285);
      doc.setTextColor(0,0,0);
      
      // Salvar PDF
      const fileName = `Locacao_Apto_${data.apartamento}_${data.nome_inquilino.split(' ')[0]}.pdf`;
      doc.save(fileName);
      
      // Mensagem de sucesso
      const mensagem = document.getElementById('mensagem');
      mensagem.innerHTML = `✅ Cadastro salvo como "${fileName}".<br>O PDF foi gerado com visual moderno.`;
      mensagem.className = 'success';
      mensagem.style.display = 'block';
    });
    
    // Função auxiliar: formatar data
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Adicionar um contato de emergência inicial automaticamente
    document.addEventListener('DOMContentLoaded', function() {
      addContatoEmergencia();
    });
