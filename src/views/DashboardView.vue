<script setup lang="ts">
// MOCKS DE DADOS PARA OS CARDS E GRIDS
const summaryCards = [
  { label: 'Equipamentos', value: 18, icon: 'fa-snowflake', color: 'bg-blue-100', trend: +4 },
  { label: 'Manutenções Pendentes', value: 5, icon: 'fa-wrench', color: 'bg-orange-100', trend: +2 },
  { label: 'Manutenções Urgentes', value: 2, icon: 'fa-triangle-exclamation', color: 'bg-red-100', trend: +1 },
  { label: 'Manutenções Concluídas', value: 32, icon: 'fa-check-circle', color: 'bg-green-100', trend: +6 },
  { label: 'Taxa de Falhas', value: '3,5%', icon: 'fa-arrow-trend-up', color: 'bg-indigo-100', trend: -1 },
]

const maintenanceAlerts = [
  { equip: 'Câmara 3', prio: 'URGENTE', descricao: 'Falha de compressor', dt: '21/11', badge: 'bg-red-200 text-red-800' },
  { equip: 'Câmara 1', prio: 'ALTA', descricao: 'Sensor temp. fora da faixa', dt: '20/11', badge: 'bg-orange-200 text-orange-900' },
  { equip: 'Freezer B', prio: 'MÉDIA', descricao: 'Oscilação de voltagem', dt: '20/11', badge: 'bg-yellow-50 text-yellow-700' },
  { equip: 'Câmara 2', prio: 'BAIXA', descricao: 'Limpeza preventiva', dt: '22/11', badge: 'bg-sky-50 text-sky-800' }
]

const nextMaintenances = [
  { equip: 'Câmara 1', tipo: 'Preventiva', prof: 'Maria S.', dt: '23/11', status: 'Agendada' },
  { equip: 'Câmara 2', tipo: 'Corretiva', prof: 'João L.', dt: '24/11', status: 'Agendada' },
  { equip: 'Freezer B', tipo: 'Sensor', prof: 'Equipe Fox', dt: '24/11', status: 'Pendente' }
]

const sectorPerformance = [
  { label: 'Açougue', percent: 90 },
  { label: 'Padaria', percent: 84 },
  { label: 'Frutas', percent: 99 },
  { label: 'Laticínios', percent: 92 }
]

function alertBadgeClass(prio: string) {
  switch (prio) {
    case 'URGENTE': return 'badge-urgente'
    case 'ALTA': return 'badge-alta'
    case 'MÉDIA': return 'badge-media'
    default: return 'badge-baixa'
  }
}
</script>

<template>
  <section class="dashboard">
    <!-- LINHA DE CARDS RESUMO -->
    <div class="dashboard-cards-row">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="dashboard-card"
        :class="card.color"
      >
        <div class="dashboard-card-icon">
          <i :class="['fas', card.icon]"></i>
        </div>
        <div class="dashboard-card-data">
          <span class="dashboard-card-label">{{ card.label }}</span>
          <span class="dashboard-card-value">{{ card.value }}</span>
        </div>
        <span class="dashboard-card-trend" :class="{up: card.trend >= 0, down: card.trend < 0}">
          <i :class="card.trend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
          {{ Math.abs(card.trend) }}
        </span>
      </div>
    </div>
    <!-- PAINÉIS PRINCIPAIS EM FLEX -->
    <div class="dashboard-panels-row">
      <!-- ALERTAS -->
      <div class="dashboard-panel dashboard-panel--alertas">
        <div class="dashboard-panel-title">Alertas de Manutenção</div>
        <ul class="dashboard-alert-list">
          <li v-for="alert in maintenanceAlerts" :key="alert.equip + alert.descricao" class="dashboard-alert-item">
            <span :class="['alert-badge', alertBadgeClass(alert.prio)]">{{ alert.prio }}</span>
            <span class="alert-equip">{{ alert.equip }}</span>
            <span class="alert-desc">{{ alert.descricao }}</span>
            <span class="alert-date">{{ alert.dt }}</span>
          </li>
        </ul>
      </div>
      <!-- PRÓXIMAS MANUTENÇÕES -->
      <div class="dashboard-panel dashboard-panel--prox">
        <div class="dashboard-panel-title">Próximas Manutenções</div>
        <table class="dashboard-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Tipo</th>
              <th>Responsável</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mnt in nextMaintenances" :key="mnt.equip + mnt.dt">
              <td>{{ mnt.equip }}</td>
              <td>{{ mnt.tipo }}</td>
              <td>{{ mnt.prof }}</td>
              <td>{{ mnt.dt }}</td>
              <td><span class="badge status-badge">{{ mnt.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- PERFORMANCE POR SETOR ABAIXO, EM TODA LARGURA -->
    <div class="dashboard-panel dashboard-panel--setores">
      <div class="dashboard-panel-title">Performance por Setor</div>
      <ul class="dashboard-sectors">
        <li v-for="sec in sectorPerformance" :key="sec.label" class="sector-item">
          <span class="sector-label">{{ sec.label }}</span>
          <div class="sector-bar-wrapper">
            <div class="sector-bar" :style="{ width: sec.percent + '%' }"></div>
            <span class="sector-percent">{{ sec.percent }}%</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.2rem 1rem 1.2rem 1rem;
  box-sizing: border-box;
  min-width: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--bg-main);
}

/* Cards resumo (topo) */
.dashboard-cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  margin-bottom: 2.1rem;
  width: 100%;
  min-width: 0;
}
.dashboard-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--box-shadow-main);
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.2rem 1.3rem 1.2rem 1.1rem;
  flex: 1 1 0;
  min-width: 140px;
  max-width: 240px;
  overflow: hidden;
  position: relative;
  word-break: break-word;
}
.dashboard-card-icon {
  background: var(--bg-input);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.32rem;
  color: var(--btn-bg-hover);
}
.dashboard-card-label {
  color: var(--text-subtitle);
  font-size: 1.01rem;
  font-weight: 500;
  display: block;
  word-break: break-word;
  max-width: 110px;
}
.dashboard-card-value {
  color: var(--text-accent);
  font-size: 1.88rem;
  font-weight: 700;
  margin-left: 1px;
  display: block;
  word-break: break-word;
  max-width: 140px;
}
.dashboard-card-trend {
  position: absolute;
  right: 15px;
  bottom: 10px;
  font-size: 0.94rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}
.dashboard-card-trend.up { color: #33ad7a; }
.dashboard-card-trend.down { color: #d9504d; }

/* Painéis principais (painéis em linha com flex) */
.dashboard-panels-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  min-width: 0;
}
.dashboard-panel {
  background: var(--bg-card);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main);
  padding: 1.35rem 1.1rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  word-break: break-word;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}
.dashboard-panel--alertas,
.dashboard-panel--prox {
  flex: 1 1 0;
  margin: 0;
  min-width: 200px;
  max-width: 100%;
}
.dashboard-panel-title {
  font-size: 1.13rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
  color: var(--text-accent);
  word-break: break-word;
}

/* Alertas de manutenção */
.dashboard-alert-list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
}
.dashboard-alert-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 4px 7px 8px;
  border-radius: 7px;
  background: var(--bg-main);
  font-size: 1rem;
  word-break: break-word;
  min-width: 0;
}
.alert-badge, .badge-urgente, .badge-alta, .badge-media, .badge-baixa {
  min-width: 46px;
  max-width: 99px;
  font-weight: 700;
  text-align: center;
  border-radius: 9px;
  padding: 2px 7px;
  font-size: 0.95em;
  overflow-wrap: break-word;
  background: var(--bg-input);
  border: 1.2px solid transparent;
}
.badge-urgente { background: var(--badge-error-bg, #e74848); color: var(--badge-error-text, var(--btn-text)); }
.badge-alta { background: var(--badge-warn-bg, #edb440); color: var(--badge-warn-text, var(--text-main)); }
.badge-media { background: var(--badge-info-bg, #5aa7db); color: var(--badge-info-text, var(--text-main)); }
.badge-baixa { background: var(--badge-low-bg, #a3e3cb); color: var(--badge-low-text, var(--text-main)); }
.alert-equip { color: var(--text-accent); font-weight: 700; margin-right: 6px; }
.alert-desc { flex: 1 1 auto; min-width: 0; word-break: break-word; color: var(--text-label); }
.alert-date { font-size: 0.96em; color: var(--text-label); margin-left: 7px; white-space: nowrap; transform: translateX(-10px);}

/* Próximas manutenções (tabela) */
.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  background: transparent;
  min-width: 0;
}
.dashboard-table th,
.dashboard-table td {
  padding: 10px 8px;
  text-align: left;
  color: var(--text-main);
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 125px;
}
.dashboard-table th {
  background: var(--bg-input);
  color: var(--text-accent);
  font-weight: 700;
  border-bottom: 2px solid var(--card-border);
  font-size: 1.05rem;
}
.dashboard-table td { border-bottom: 1px solid var(--card-border); }
.badge.status-badge {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
  border-radius: 8px;
  padding: 2px 12px;
  font-size: 0.98em;
  font-weight: 600;
}

/* Performance por setor */
.dashboard-panel--setores {
  margin-top: 1.1rem;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  align-self: stretch;
  box-sizing: border-box;
}
.dashboard-sectors {
  margin: 0; padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  min-width: 0;
}
.sector-item { display: flex; align-items: center; gap: 1.1rem; min-width: 0; }
.sector-label { min-width: 75px; font-weight: 600; color: var(--text-main); overflow-wrap: break-word; }
.sector-bar-wrapper {
  flex: 1 1 auto;
  background: var(--bg-input);
  border-radius: 6px;
  display: flex;
  align-items: center;
  position: relative;
  height: 22px;
  min-width: 60px;
  padding: 1px;
  overflow: hidden;
}
.sector-bar {
  background: linear-gradient(90deg, var(--btn-bg-hover) 70%, var(--btn-bg) 100%);
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s;
}
.sector-percent {
  position: absolute;
  right: 9px;
  color: var(--text-main);
  font-size: 0.97em;
  font-weight: 600;
}

/* Responsivo */
@media (max-width: 1100px) {
  .dashboard-panel--alertas, .dashboard-panel--prox { min-width: 150px; }
}
@media (max-width: 900px) {
  .dashboard { padding: 1.2rem 0.2rem; min-width: 0; }
  .dashboard-cards-row { flex-direction: column; gap: 1rem; width: 100%; }
  .dashboard-panels-row { flex-direction: column; gap: 1.1rem; }
  .dashboard-panel--setores { margin-top: 1.3rem; width: 100%; }
}
@media (max-width: 600px) {
  .dashboard-panel { padding-left: 0.7rem; padding-right: 0.7rem; }
  .dashboard-table th, .dashboard-table td {
    font-size: 0.95rem;
    padding: 7px 2px;
    max-width: 80vw;
  }
}

::-webkit-scrollbar { width: 7px; background: transparent; }
</style>