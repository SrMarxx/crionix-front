<script setup lang="ts">

// Cards de indicadores principais (KPIs)
const kpiCards = [
  {
    label: 'Equipamentos Ativos',
    value: 24,
    icon: 'fa-snowflake',
    color: 'bg-blue-100',
    trend: +2,
    trendLabel: 'este mês'
  },
  {
    label: 'Manutenções Pendentes',
    value: 7,
    icon: 'fa-clock',
    color: 'bg-orange-100',
    trend: +3,
    trendLabel: '3 urgentes'
  },
  {
    label: 'Concluídas este Mês',
    value: 18,
    icon: 'fa-circle-check',
    color: 'bg-green-100',
    trend: +12,
    trendLabel: 'vs mês anterior'
  },
  {
    label: 'Taxa de Falhas (%)',
    value: '4.2',
    icon: 'fa-triangle-exclamation',
    color: 'bg-red-100',
    trend: -1.3,
    trendLabel: 'vs mês anterior'
  },
  {
    label: 'Custo Total (R$)',
    value: '3.450',
    icon: 'fa-piggy-bank',
    color: 'bg-cyan-100',
    trend: +350,
    trendLabel: 'vs mês ant.'
  },
  {
    label: 'Custo Médio p/ manutenção (R$)',
    value: '193',
    icon: 'fa-coins',
    color: 'bg-violet-100',
    trend: -14,
    trendLabel: 'vs mês ant.'
  },
  {
    label: 'Tempo Médio por manutenção',
    value: '1,7d',
    icon: 'fa-stopwatch',
    color: 'bg-fuchsia-100',
    trend: -0.4,
    trendLabel: 'dias'
  }
]

// Gráfico 1: Manutenções por mês (mock)
const manutSeries = [
  { name: 'Manutenções', data: [9, 11, 13, 16, 14, 15, 14] }
]
const manutOptions = {
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  xaxis: { categories: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'] },
  dataLabels: { enabled: false },
  colors: ['#3b82f6'],
  grid: { borderColor: 'var(--card-border)', strokeDashArray: 4 },
  tooltip: { enabled: true }
}

// Gráfico 2: Custos de manutenção por mês (mock)
const custoSeries = [{ name: 'Custo', data: [2000, 2400, 1920, 3760, 3400, 3700, 3450] }]
const custoOptions = {
  chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
  xaxis: { categories: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'] },
  dataLabels: { enabled: false },
  colors: ['#06b6d4'],
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0 } },
  grid: { borderColor: 'var(--card-border)', strokeDashArray: 4 },
  tooltip: { enabled: true }
}

// Gráfico 3: Falhas por tipo (mock)
const falhasSeries = [40, 22, 19, 7]
const falhasOptions = {
  chart: { type: 'donut', background: 'transparent', toolbar: { show: false } },
  labels: ['Elétrico', 'Sensor', 'Mecânico', 'Ambiental'],
  colors: ['#ec4899','#64748b','#22d3ee','#fcd34d'],
  legend: { show: true, position: 'bottom' },
  tooltip: { enabled: true }
}
</script>

<template>
  <section class="reports">
    <h2 class="rep-title">Relatórios Gerenciais</h2>
    <!-- KPIs em cards -->
    <div class="rep-kpis-row">
      <div
        class="rep-kpi-card"
        v-for="card in kpiCards"
        :key="card.label"
        :class="card.color"
      >
        <div class="rep-kpi-icon"><i :class="['fas', card.icon]"></i></div>
        <div class="rep-kpi-info">
          <span class="rep-kpi-label">{{ card.label }}</span>
          <span class="rep-kpi-value">{{ card.value }}</span>
          <span class="rep-kpi-trend" :class="{ up: card.trend > 0, down: card.trend < 0 }">
            <i :class="card.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
            {{ Math.abs(card.trend) }}
            <small> {{ card.trendLabel }} </small>
          </span>
        </div>
      </div>
    </div>
    <!-- Gráficos principais -->
    <div class="rep-grids">
      <div class="rep-card">
        <div class="rep-card-title">Manutenções por mês</div>
        <apexchart
          type="bar"
          height="240"
          :options="manutOptions"
          :series="manutSeries"
        />
      </div>
      <div class="rep-card">
        <div class="rep-card-title">Custo por mês (R$)</div>
        <apexchart
          type="area"
          height="240"
          :options="custoOptions"
          :series="custoSeries"
        />
      </div>
      <div class="rep-card">
        <div class="rep-card-title">Falhas por tipo</div>
        <apexchart
          type="donut"
          height="240"
          :options="falhasOptions"
          :series="falhasSeries"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.reports {
  max-width: 1100px;
  margin: 0 auto 2.6rem auto;
  padding: 2.15rem 1.2rem 0 1.2rem;
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: var(--bg-main);
}
.rep-title {
  font-size: 1.38rem;
  font-weight: 700;
  color: var(--text-accent);
  margin-bottom: 1.6rem;
}
.rep-kpis-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.12rem;
  margin-bottom: 2rem;
  width: 100%;
  min-width: 0;
}
.rep-kpi-card {
  background: var(--bg-card);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main);
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.09rem 1.15rem;
  flex: 1 1 220px;
  min-width: 140px;
  max-width: 250px;
  overflow: hidden;
  position: relative;
  word-break: break-word;
}
.rep-kpi-icon {
  background: var(--bg-input);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.22rem;
  color: var(--btn-bg-hover);
}
.rep-kpi-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}
.rep-kpi-label {
  color: var(--text-subtitle);
  font-size: 1.01rem;
  font-weight: 500;
  margin-bottom: 2px;
}
.rep-kpi-value {
  color: var(--text-accent);
  font-size: 1.88rem;
  font-weight: 700;
}
.rep-kpi-trend {
  font-size: 0.99rem;
  font-weight: 600;
  margin-top: 2px;
  display: flex;
  align-items: center;
}
.rep-kpi-trend.up { color: #33ad7a; }
.rep-kpi-trend.down { color: #d9504d; }
.rep-kpi-trend small {
  margin-left: 5px;
  color: var(--text-label);
  font-size: 0.89em;
}

.rep-grids {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  min-width: 0;
}
.rep-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--box-shadow-main);
  padding: 1.35rem 1.1rem 1.2rem 1.1rem;
  min-width: 0;
  width: 100%;
  max-width: 355px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-sizing: border-box;
}
.rep-card-title {
  font-size: 1.08rem;
  color: var(--text-accent);
  font-weight: 600;
  margin-bottom: 0.93rem;
}

/* ApexCharts container */
.apexcharts-canvas {
  background: transparent !important;
}

/* Responsivo */
@media (max-width: 1150px) {
  .rep-grids { flex-direction: column; gap: 1.1rem; }
  .rep-card { max-width: 98vw; }
}
@media (max-width: 800px) {
  .rep-title { font-size: 1.09rem; }
  .rep-kpi-card { padding: 0.82rem 0.43rem; max-width: 97vw; }
  .rep-card { padding: 1.1rem 0.55rem; }
}
@media (max-width: 600px) {
  .rep-grids { gap: 0.82rem; }
  .rep-card { padding: 0.88rem 0.2rem; }
  .rep-kpi-card { font-size: 0.95em; }
  .rep-title { font-size: 1.05rem; }
}

::-webkit-scrollbar { width: 7px; background: transparent; }
</style>