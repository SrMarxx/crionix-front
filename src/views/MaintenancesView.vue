<script setup lang="ts">
// Mock exemplo de manutenções
const manutencoes = [
  {
    id: 1,
    setor: 'Setor A',
    equipamento: 'Câmara Fria 01',
    tipo: 'Preventiva',
    prioridade: 'Alta',
    status: 'Vencendo',
    data: '2025-10-18',
    responsavel: 'Maria Santos',
  },
  {
    id: 2,
    setor: 'Setor B',
    equipamento: 'Câmara Fria 05',
    tipo: 'Corretiva',
    prioridade: 'Urgente',
    status: 'Atrasada',
    data: '2025-10-15',
    responsavel: 'João Silva',
  },
  {
    id: 3,
    setor: 'Setor C',
    equipamento: 'Câmara Fria 12',
    tipo: 'Preventiva',
    prioridade: 'Média',
    status: 'Programada',
    data: '2025-10-22',
    responsavel: 'Carlos Oliveira',
  },
  {
    id: 4,
    setor: 'Setor A',
    equipamento: 'Câmara Fria 08',
    tipo: 'Inspeção',
    prioridade: 'Baixa',
    status: 'Programada',
    data: '2025-10-25',
    responsavel: 'Ana Lima',
  }
]

// Helpers de cor
function prioridadeClass(p:string) {
  switch (p) {
    case 'Urgente': return 'badge-urgente'
    case 'Alta': return 'badge-alta'
    case 'Média': return 'badge-media'
    default: return 'badge-baixa'
  }
}
function statusClass(s:string) {
  switch (s) {
    case 'Vencendo': return 'badge-vencendo'
    case 'Atrasada': return 'badge-atrasada'
    case 'Programada': return 'badge-programada'
    default: return 'badge-ok'
  }
}
</script>

<template>
  <section class="maintenances">
    <h2 class="maint-title">Registros de Manutenções</h2>
    <div class="maint-list">
      <div
        class="maint-card"
        v-for="mnt in manutencoes"
        :key="mnt.id"
      >
        <div class="maint-card-row">
          <span class="maint-equip">{{ mnt.equipamento }}</span>
          <span class="maint-setor">{{ mnt.setor }}</span>
        </div>
        <div class="maint-card-row maint-card-labels">
          <span class="maint-badge" :class="prioridadeClass(mnt.prioridade)">
            {{ mnt.prioridade }}
          </span>
          <span class="maint-badge" :class="statusClass(mnt.status)">
            {{ mnt.status }}
          </span>
          <span class="maint-type">{{ mnt.tipo }}</span>
          <span class="maint-data">{{ mnt.data }}</span>
          <span class="maint-resp">{{ mnt.responsavel }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.maintenances {
  max-width: 900px;
  margin: 0 auto 2.4rem auto;
  padding: 2.1rem 1.1rem 0 1.1rem;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: 100vh;
}
.maint-title {
  font-size: 1.38rem;
  font-weight: 700;
  color: var(--text-accent);
  margin-bottom: 1.4rem;
  text-align: left;
}
.maint-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}
.maint-card {
  background: var(--bg-card);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main);
  padding: 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
  word-break: break-word;
}
.maint-card-row {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
  min-width: 0;
}
.maint-equip {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--text-main);
  margin-right: 12px;
}
.maint-setor {
  font-size: 1rem;
  color: var(--text-label);
  flex: 0 0 auto;
}
.maint-card-labels {
  gap: 0.7rem;
  margin-top: 4px;
  flex-wrap: wrap;
}
.maint-type, .maint-data, .maint-resp {
  font-size: 0.98rem;
  color: var(--text-subtitle);
  background: var(--bg-input);
  border-radius: 7px;
  padding: 3px 11px;
  font-weight: 500;
}

.maint-badge {
  padding: 2.5px 11px;
  border-radius: 10px;
  font-size: 0.97rem;
  font-weight: 700;
  display: inline-block;
  background: var(--bg-input);
  border: none;
}
.badge-urgente { background: var(--badge-error-bg, #e74848); color: var(--badge-error-text, #fff); }
.badge-alta { background: var(--badge-warn-bg, #edb440); color: var(--badge-warn-text, #312806);}
.badge-media { background: var(--badge-info-bg, #5aa7db); color: var(--badge-info-text, #16314c);}
.badge-baixa { background: var(--badge-low-bg, #a3e3cb); color: var(--badge-low-text, #054c37);}
.badge-vencendo { background: var(--badge-warn-bg, #edb440); color: var(--badge-warn-text, #313a06);}
.badge-atrasada { background: var(--badge-error-bg, #e74848); color: var(--badge-error-text, #fff);}
.badge-programada { background: var(--bg-input); color: var(--text-main);}
.badge-ok { background: var(--bg-input); color: var(--btn-bg-hover);}

@media (max-width: 700px) {
  .maint-title { font-size: 1.09rem; }
  .maint-card-row { flex-direction: column; align-items: flex-start; gap: 0.46rem;}
  .maint-card-labels { gap: 0.44rem; }
  .maint-card { padding: 1rem 0.6rem; }
}
</style>
