<script setup lang="ts">
// MOCK - Array de equipamentos
const equipamentos = [
  {
    id: 1,
    nome: 'Câmara Fria 01',
    setor: 'Açougue',
    status: 'ATIVO',
    tipo: 'Freezer',
    tensao: '127V',
    faixas: '117V ~ 137V',
    sensores: ['Temperatura', 'Umidade'],
  },
  {
    id: 2,
    nome: 'Câmara Fria 05',
    setor: 'Padaria',
    status: 'MANUTENÇÃO',
    tipo: 'Câmara Fria',
    tensao: '220V',
    faixas: '210V ~ 230V',
    sensores: ['Temperatura', 'Pressão'],
  },
  {
    id: 3,
    nome: 'Freezer B',
    setor: 'Laticínios',
    status: 'ATIVO',
    tipo: 'Freezer',
    tensao: '127V',
    faixas: '117V ~ 137V',
    sensores: ['Temperatura', 'Umidade', 'Door'],
  },
  {
    id: 4,
    nome: 'Câmara Fria 08',
    setor: 'Frutas',
    status: 'INATIVO',
    tipo: 'Câmara Fria',
    tensao: '220V',
    faixas: '210V ~ 230V',
    sensores: ['Temperatura'],
  }
]

// Helpers:
function statusClass(s:string) {
  switch (s) {
    case 'ATIVO': return 'badge-ativo'
    case 'MANUTENÇÃO': return 'badge-manut'
    case 'INATIVO': return 'badge-inativo'
    default: return ''
  }
}
function sensorIcon(t:string) {
  switch (t) {
    case 'Temperatura': return 'fa-thermometer-half'
    case 'Umidade': return 'fa-water'
    case 'Pressão': return 'fa-gauge-high'
    case 'Door': return 'fa-door-open'
    default: return 'fa-circle'
  }
}
</script>

<template>
  <section class="equipments">
    <h2 class="eq-title">Lista de Equipamentos</h2>
    <div class="eq-list">
      <div v-for="eq in equipamentos" :key="eq.id" class="eq-card">
        <div class="eq-card-row">
          <span class="eq-nome">{{ eq.nome }}</span>
          <span class="eq-setor">{{ eq.setor }}</span>
        </div>
        <div class="eq-card-row eq-labels">
          <span class="eq-badge" :class="statusClass(eq.status)">{{ eq.status }}</span>
          <span class="eq-tipo">{{ eq.tipo }}</span>
          <span class="eq-tensao">{{ eq.tensao }}</span>
          <span class="eq-faixas">{{ eq.faixas }}</span>
          <span class="eq-sensores">
            <i v-for="s in eq.sensores" :key="s" :class="['fas', sensorIcon(s)]" :title="s"></i>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.equipments {
  max-width: 900px;
  margin: 0 auto 2.4rem auto;
  padding: 2.1rem 1.1rem 0 1.1rem;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100vh;
}
.eq-title {
  font-size: 1.38rem;
  font-weight: 700;
  color: var(--text-accent);
  margin-bottom: 1.4rem;
  text-align: left;
}
.eq-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
}
.eq-card {
  background: var(--bg-card);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main);
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  width: 100%;
  min-width: 0;
  word-break: break-word;
}
.eq-card-row {
  display: flex;
  align-items: center;
  gap: 1.05rem;
  flex-wrap: wrap;
  min-width: 0;
}
.eq-nome {
  font-size: 1.13rem;
  font-weight: 700;
  color: var(--text-main);
  margin-right: 12px;
}
.eq-setor {
  font-size: 1.01rem;
  color: var(--text-label);
  flex: 0 0 auto;
}
.eq-labels {
  gap: 0.67rem;
  margin-top: 3px;
  flex-wrap: wrap;
}
.eq-tipo, .eq-tensao, .eq-faixas {
  font-size: 0.97rem;
  color: var(--text-subtitle);
  background: var(--bg-input);
  border-radius: 7px;
  padding: 3px 10px;
  font-weight: 500;
}

.eq-sensores i {
  margin-right: 6px;
  font-size: 1.13rem;
  color: var(--btn-bg-hover);
}
.eq-sensores i:last-child {
  margin-right: 0;
}
.eq-badge {
  padding: 2.5px 11px;
  border-radius: 10px;
  font-size: 0.96rem;
  font-weight: 700;
  display: inline-block;
  background: var(--bg-input);
  border: none;
}
.badge-ativo {
  background: #daf8e0;
  color: #33ad7a;
}
.badge-manut {
  background: #ffe6b2;
  color: #d98c00;
}
.badge-inativo {
  background: #ffe3e1;
  color: #cc3b25;
}
@media (max-width: 700px) {
  .eq-title { font-size: 1.09rem; }
  .eq-card-row { flex-direction: column; align-items: flex-start; gap: 0.35rem;}
  .eq-labels { gap: 0.37rem; }
  .eq-card { padding: 1rem 0.55rem; }
}
</style>