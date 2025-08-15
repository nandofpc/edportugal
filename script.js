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
