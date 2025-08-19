// script.js
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
// Funções globais para listas dinâmicas
let veiculoCount = 0, moradorCount = 0, funcionarioCount = 0;
function addVeiculo() {
  veiculoCount++;
  const div = document.createElement('div');
  div.className = 'veiculo-item';
  div.innerHTML = `
    <label>Marca/Modelo: <input type="text" name="veiculo_modelo_${veiculoCount}" required></label>
    <label>Placa: <input type="text" name="veiculo_placa_${veiculoCount}" required></label>
    <label>Nº da Vaga: <input type="text" name="veiculo_vaga_${veiculoCount}" required></label>
    <button type="button" onclick="this.parentNode.remove()">Remover</button>
    <br>
  `;
  document.getElementById('veiculos-list').appendChild(div);
}
function addMorador() {
  moradorCount++;
  const div = document.createElement('div');
  div.className = 'morador-item';
  div.innerHTML = `
    <label>Nome completo: <input type="text" name="morador_nome_${moradorCount}" required></label>
    <label>Grau de parentesco: <input type="text" name="morador_parentesco_${moradorCount}" required></label>
    <button type="button" onclick="this.parentNode.remove()">Remover</button>
    <br>
  `;
  document.getElementById('moradores-list').appendChild(div);
}
function addFuncionario() {
  funcionarioCount++;
  const div = document.createElement('div');
  div.className = 'funcionario-item';
  div.innerHTML = `
    <label>Nome: <input type="text" name="funcionario_nome_${funcionarioCount}" required></label>
    <label>Função: <input type="text" name="funcionario_funcao_${funcionarioCount}" required></label>
    <label>RG/CPF: <input type="text" name="funcionario_doc_${funcionarioCount}" required></label>
    <button type="button" onclick="this.parentNode.remove()">Remover</button>
    <br>
  `;
  document.getElementById('funcionarios-list').appendChild(div);
}
function toggleAnimais() {
  const select = document.getElementById('animais-select');
  document.getElementById('animais-info').style.display = select.value === 'sim' ? '' : 'none';
}

// Função para converter logo em base64
async function getLogoBase64() {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = '';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
  resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = 'assets/logo_edificio_portugal.jpg';
  });
}

// Submit do formulário e geração do PDF
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('aluguelForm');
  if (!form) return;

  // Máscara para celular
  const celularInput = form.querySelector('input[name="celular"]');
  if (celularInput) {
    celularInput.addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      let out = v;
      if (v.length > 0) out = '(' + v.slice(0,2) + ')';
      if (v.length > 2) out += '-' + v.slice(2,7);
      if (v.length > 7) out += '-' + v.slice(7,11);
      e.target.value = out;
    });
  }

  // Máscara para CPF
  const cpfInput = form.querySelector('input[name="cpf_inquilino"]');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      let out = v;
      if (v.length > 3) out = v.slice(0,3) + '.' + v.slice(3);
      if (v.length > 6) out = out.slice(0,7) + '.' + out.slice(7);
      if (v.length > 9) out = out.slice(0,11) + '-' + out.slice(11);
      e.target.value = out;
    });
  }

  // Validação de CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i=1; i<=9; i++) soma += parseInt(cpf.substring(i-1,i)) * (11-i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9,10))) return false;
    soma = 0;
    for (let i=1; i<=10; i++) soma += parseInt(cpf.substring(i-1,i)) * (12-i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10,11))) return false;
    return true;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const dados = new FormData(form);
    const dadosObj = Object.fromEntries(dados.entries());

    // Validação nome
    if (!dadosObj.nome_inquilino || dadosObj.nome_inquilino.trim().length < 6) {
      alert('O nome completo deve conter pelo menos 6 caracteres.');
      form.querySelector('input[name="nome_inquilino"]').focus();
      return;
    }
    // Validação CPF
    if (!validarCPF(dadosObj.cpf_inquilino)) {
      alert('O CPF informado não é válido.');
      form.querySelector('input[name="cpf_inquilino"]').focus();
      return;
    }
    // Validação tempo de locação
    if (parseInt(dadosObj.tempo_locacao) < 30) {
      if (!confirm('O tempo de locação informado é menor que 30 meses. Tem certeza que está correto?')) {
        form.querySelector('input[name="tempo_locacao"]').focus();
        return;
      }
    }

    const inquilino = [
      ['Nome completo', dadosObj.nome_inquilino],
      ['CPF', dadosObj.cpf_inquilino],
      ['Data de nascimento', dadosObj.nascimento_inquilino],
      ['Nº do apartamento', dadosObj.apartamento],
      ['Tempo de locação (meses)', dadosObj.tempo_locacao],
      ['Data de início da locação', dadosObj.inicio_locacao],
      ['Celular', dadosObj.celular],
      ['Email', dadosObj.email],
      ['Nome da Administradora', dadosObj.nome_adm],
      ['Telefone da Administradora', dadosObj.tel_adm]
    ];
    const veiculos = [];
    for(let i=1;i<=veiculoCount;i++){
      if(dadosObj[`veiculo_modelo_${i}`]){
        veiculos.push([
          dadosObj[`veiculo_modelo_${i}`]||'',
          dadosObj[`veiculo_placa_${i}`]||'',
          dadosObj[`veiculo_vaga_${i}`]||''
        ]);
      }
    }
    const moradores = [];
    for(let i=1;i<=moradorCount;i++){
      if(dadosObj[`morador_nome_${i}`]){
        moradores.push([
          dadosObj[`morador_nome_${i}`]||'',
          dadosObj[`morador_parentesco_${i}`]||''
        ]);
      }
    }
    const funcionarios = [];
    for(let i=1;i<=funcionarioCount;i++){
      if(dadosObj[`funcionario_nome_${i}`]){
        funcionarios.push([
          dadosObj[`funcionario_nome_${i}`]||'',
          dadosObj[`funcionario_funcao_${i}`]||'',
          dadosObj[`funcionario_doc_${i}`]||''
        ]);
      }
    }
    const outras = [
      ['Nº de Bicicletas', dadosObj.bicicletas||''],
      ['Possui Animais Domésticos', dadosObj.animais==='sim'?'Sim':'Não'],
      ['Quais e Raças', dadosObj.quais_animais||'']
    ];
    if(window.jspdf) {
      const doc = new window.jspdf.jsPDF();
      let y = 12;
      try {
        const logo = await getLogoBase64();
        doc.addImage(logo, 'JPEG', 85, y, 40, 40);
        y += 42;
      } catch {
        y += 10;
      }
      doc.setFontSize(18);
      doc.text('EDIFICIO PORTUGAL', 105, y, {align:'center'});
      y += 10;
      doc.setFontSize(14);
      doc.text('Informações de Aluguel de Apartamento', 105, y, {align:'center'});
      y += 14;
      doc.setFontSize(11);
      doc.text('Dados do Inquilino', 10, y);
      y += 2;
      doc.autoTable({
        startY: y,
        head: [['Campo', 'Valor']],
        body: inquilino,
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:10, right:10}
      });
      y = doc.lastAutoTable.finalY + 6;
      if(veiculos.length) {
        doc.text('Veículos', 10, y);
        y += 2;
        doc.autoTable({
          startY: y,
          head: [['Marca/Modelo','Placa','Nº da Vaga']],
          body: veiculos,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:10, right:10}
        });
        y = doc.lastAutoTable.finalY + 6;
      }
      if(moradores.length) {
        doc.text('Outros Moradores', 10, y);
        y += 2;
        doc.autoTable({
          startY: y,
          head: [['Nome completo','Grau de parentesco']],
          body: moradores,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:10, right:10}
        });
        y = doc.lastAutoTable.finalY + 6;
      }
      if(funcionarios.length) {
        doc.text('Funcionários Domésticos', 10, y);
        y += 2;
        doc.autoTable({
          startY: y,
          head: [['Nome','Função','RG/CPF']],
          body: funcionarios,
          theme: 'grid',
          styles: {fontSize:10},
          margin: {left:10, right:10}
        });
        y = doc.lastAutoTable.finalY + 6;
      }
      doc.text('Outras Informações', 10, y);
      y += 2;
      doc.autoTable({
        startY: y,
        head: [['Campo','Valor']],
        body: outras,
        theme: 'grid',
        styles: {fontSize:10},
        margin: {left:10, right:10}
      });
      doc.save('aluguel_apartamento.pdf');
    }
    document.getElementById('mensagem').innerHTML = '<b>PDF gerado! Envie o arquivo por email para a administração.</b>';
  });
});
   
