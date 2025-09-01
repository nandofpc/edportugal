# 🏢 Edifício Portugal – Portal do Condomínio

Bem-vindo ao **Portal do Condomínio Edifício Portugal**, uma solução web moderna e intuitiva para facilitar a gestão do dia a dia do condomínio.  
Este portal permite que **moradores** e **administradores** acessem normas, realizem cadastros, reservem áreas comuns e informem obras de forma prática e organizada.

---

## 🌟 Funcionalidades

O sistema é composto por páginas independentes, cada uma com uma função específica e design responsivo:

### 🏠 Menu Principal (`index.html`)
- Interface central com acesso rápido a todas as funcionalidades.
- Navegação intuitiva por botões com ícones.
- Design limpo e responsivo.

---

### 📜 Normas do Condomínio (`normas.html`)
- Visualização clara e organizada das regras internas do edifício.
- Fácil leitura com formatação amigável.

---

### 🧑‍💼 Cadastro de Inquilino (`pages/inquilino.html`)
- Formulário completo com campos para:
  - Dados pessoais (CPF, celular com máscara)
  - Apartamento
  - Veículo (1)
  - Outros moradores, funcionários e animais
- Geração automática de **PDF personalizado** com logo do condomínio.

---

### 👨‍👩‍👧‍👦 Cadastro de Morador (`pages/morador_v2.html`)
- Formulário avançado com:
  - Validação de CPF, RG, celular e CEP
  - Busca automática de endereço via [ViaCEP](https://viacep.com.br)
  - Cadastro dinâmico de:
    - Veículos (múltiplos)
    - Contatos de emergência
    - Funcionários domésticos
    - Animais
- Geração de **PDF moderno e profissional**
- Feedback visual de sucesso ou erro após envio

---

### 🔨 Comunicação de Obras (`pages/comu_obra.html`)
- Registro de obras realizadas nas unidades.
- Cadastro dinâmico de prestadores de serviço:
  - Nome, CPF, função, celular
- Validação obrigatória: ao menos um prestador deve ser informado.
- Geração de **PDF com todos os detalhes da obra**.

---

### 🎉 Reserva do Salão de Festas (`pages/salao.html`)
- Formulário simples e eficaz para reservar o salão.
- Seleção de apartamento e data (com bloqueio de datas especiais):
  - 24/12, 25/12, 31/12, 01/01
- Exibição do valor da reserva.
- Confirmação com mensagem clara e **botão para envio automático via WhatsApp** ao síndico/administrador.

---

## ✨ Recursos Técnicos

- **Design moderno e responsivo** (mobile-friendly)
- **Logo do Edifício Portugal** em todas as páginas e PDFs
- **Validações de formulário** em tempo real
- **Feedback visual** em todas as ações (sucesso, erro, alerta)
- **Botão de retorno ao menu principal** em todas as páginas
- **Integração com WhatsApp Web** para comunicação direta

---

## 🗂️ Estrutura de Pastas
/
├── index.html
├── normas.html
├── pages/
│ ├── inquilino.html
│ ├── morador_v2.html
│ ├── comu_obra.html
│ ├── salao.html
│ └── js/
│ └── script.js
│ └── style.css
├── assets/
│ ├── logo_edificio_portugal.jpg
│ └── logo-22-ot.jpg


---

## 🚀 Como Usar

1. Abra o arquivo `index.html` no navegador.
2. Escolha a funcionalidade desejada no menu principal.
3. Preencha os formulários com atenção.
4. Gere PDFs ou confirme reservas diretamente pela interface.

> 💡 **Dica**: Para funcionalidades completas (busca de CEP, carregamento de imagens, etc.), execute o projeto em um servidor local (como `Live Server` no VS Code) ou em um ambiente com suporte a arquivos estáticos.

---

## ⚠️ Observações

- Certifique-se de que os caminhos dos arquivos (imagens, CSS, JS) estão corretos no seu ambiente.
- O sistema é **100% estático** (HTML, CSS, JS), sem necessidade de backend.
- Ideal para hospedagem em servidores simples ou até em redes locais do condomínio.

---


<div align="center">
  <img src="assets/logo_edificio_portugal.jpg" alt="Logo Edifício Portugal" width="150" />
  <p><strong>Edifício Portugal – Portal do Condomínio</strong><br>Modernidade, praticidade e organização para todos os moradores.</p>
</div>