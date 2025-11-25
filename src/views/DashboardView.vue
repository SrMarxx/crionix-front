<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axiosInstance from '@/api/axiosConfig'
import type { ResumoResponseDTO, PerformanceProfile, ManutencaoResponseDTO } from '@/configs/types'

// Estado dos dados do backend
const resumo = ref<ResumoResponseDTO | null>(null)
const performance = ref<PerformanceProfile[]>([])
const manutencao = ref<ManutencaoResponseDTO[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// Busca todos dados necessários em paralelo
onMounted(async () => {
  isLoading.value = true
  try {
    const [resResumo, resPerformance, resManutencao] = await Promise.all([
      axiosInstance.get<ResumoResponseDTO>('/dashboard/resume'),
      axiosInstance.get<PerformanceProfile[]>('/dashboard/performance'),
      axiosInstance.get<ManutencaoResponseDTO[]>('/manutencao/ativa'),
    ])
    resumo.value = resResumo.data
    performance.value = resPerformance.data
    manutencao.value = resManutencao.data
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados do dashboard.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

// Computed dos cards resumo
const summaryCards = computed(() => [
  {
    label: 'Equipamentos',
    value: resumo.value?.equipamentos?.quantidadeAtual ?? '-',
    icon: 'fa-snowflake',
    color: 'bg-blue-100',
    trend: Number(resumo.value?.equipamentos?.vsMesAnterior ?? 0)
  },
  {
    label: 'Manutenções Pendentes',
    value: resumo.value?.pendentes.quantidadePendentes ?? '-',
    icon: 'fa-wrench',
    color: 'bg-orange-100',
    trend: Number(resumo.value?.pendentes.quantidadeUrgentes ?? 0)
  },
  {
    label: 'Manutenções Concluídas',
    value: resumo.value?.concluidas.quantidadeAtual ?? '-',
    icon: 'fa-check-circle',
    color: 'bg-green-100',
    trend: Number(resumo.value?.concluidas.vsMesAnterior ?? 0)
  },
  {
    label: 'Taxa de Falhas',
    value: resumo.value?.falhas.quantidadeFalha ?? '-',
    icon: 'fa-arrow-trend-up',
    color: 'bg-indigo-100',
    trend: Number(resumo.value?.falhas.vsMesAnterior ?? 0)
  },
])

// Computed: 4 alertas mais urgentes
const prioridadeOrdem = { 'URGENTE': 1, 'ALTA': 2, 'MEDIA': 3, 'BAIXA': 4 }
const alertsTop5 = computed(() =>
  [...manutencao.value]
    .filter(m => m.ativo)
    .sort((a, b) => (prioridadeOrdem[a.prioridade] ?? 5) - (prioridadeOrdem[b.prioridade] ?? 5))
    .slice(0, 5)
)

// Computed: 4 próximas manutenções agendadas (mais antigas)
const proximasManutencoes = computed(() =>
  [...manutencao.value]
    .filter(m => m.ativo && !m.dataConclusao && m.dataLimite)
    .sort((a, b) =>
      new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime()
    )
    .slice(0, 4)
)

// Computed: performance por setor ordenado decrescente
const performanceSetores = computed(() =>
  [...performance.value].sort((a, b) => b.performance - a.performance)
)

// Helper para label bonitinho do setor
function setorLabel(code: string) {
  switch (code) {
    case 'ACOUGUE': return 'Açougue'
    case 'PADARIA': return 'Padaria'
    case 'FRUTAS': return 'Frutas'
    case 'LATICINIOS': return 'Laticínios'
    default: return code
  }
}

// Badge de prioridade
function alertBadgeClass(prio: string) {
  switch (prio) {
    case 'URGENTE': return 'badge-urgente'
    case 'ALTA': return 'badge-alta'
    case 'MEDIA': return 'badge-media'
    default: return 'badge-baixa'
  }
}

// Helper formato de data DD/MM
function formatDate(data: string) {
  if (!data) return '-'
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <section class="dashboard">
    <!-- LINHA DE CARDS RESUMO -->
    <div class="dashboard-cards-row">
      <div
        v-for="(card, index) in summaryCards"
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
        <span v-if="index == 1" class="dashboard-card-trend down">
          <i class="fas fa-exclamation-triangle"></i>
          {{ Math.abs(card.trend) }} urgentes
        </span>
        <span v-else-if="index == 3" class="dashboard-card-trend" :class="{ down: card.trend >= 0, up: card.trend < 0 }">
          <i :class="card.trend >= 0 ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'"></i>
          {{ Math.abs(card.trend) }}% vs ultimo mês
        </span>
        <span v-else class="dashboard-card-trend" :class="{ up: card.trend >= 0, down: card.trend < 0 }">
          <i :class="card.trend >= 0 ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'"></i>
          {{ Math.abs(card.trend) }}% vs ultimo mês
        </span>
      </div>
    </div>

    <!-- CARDS PRINCIPAIS EM FLEX -->
    <div class="dashboard-panels-row">
      <!-- ALERTAS: 4 mais urgentes -->
      <div class="dashboard-panel dashboard-panel--alertas">
        <div class="dashboard-panel-title">Alertas de Manutenção</div>
        <ul class="dashboard-alert-list">
          <li v-for="alert in alertsTop5" :key="alert.id" class="dashboard-alert-item">
            <span :class="['alert-badge', alertBadgeClass(alert.prioridade)]">{{ alert.prioridade }}</span>
            <span class="alert-equip">{{ alert.maquina }}</span>
            <span class="alert-desc">{{ alert.descricao }}</span>
            <span class="alert-date">{{ formatDate(alert.dataLimite) }}</span>
          </li>
        </ul>
      </div>
      <!-- PRÓXIMAS MANUTENÇÕES: 4 mais próximas -->
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
            <tr v-for="mnt in proximasManutencoes" :key="mnt.id">
              <td>{{ mnt.maquina }}</td>
              <td>{{ mnt.tipo }}</td>
              <td>{{ mnt.colaborador }}</td>
              <td>{{ formatDate(mnt.dataLimite) }}</td>
              <td>
                <span class="badge status-badge">
                  {{ mnt.dataConclusao ? 'Concluída' : 'Agendada' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- PERFORMANCE POR SETOR ABAIXO, EM TODA LARGURA -->
    <div class="dashboard-panel dashboard-panel--setores">
      <div class="dashboard-panel-title">Performance por Setor</div>
      <ul class="dashboard-sectors">
        <li v-for="sec in performanceSetores" :key="sec.setor" class="sector-item">
          <span class="sector-label">{{ setorLabel(sec.setor) }}</span>
          <div class="sector-bar-wrapper">
            <div class="sector-bar" :style="{ width: sec.performance + '%' }"></div>
            <span class="sector-percent">{{ Number(sec.performance).toFixed(2) }}%</span>
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
  background: var(--bg-main, #f9fafe);
}

/* Cards resumo */
.dashboard-cards-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1.1rem;
  margin-bottom: 2.1rem;
  width: 100%;
  min-width: 0;
}
.dashboard-card {
  background: var(--bg-card, #fff);
  border-radius: 12px;
  box-shadow: var(--box-shadow-main, 0 2px 24px #0001);
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
  background: var(--bg-input, #eee);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.32rem;
  color: var(--btn-bg-hover, #3b82f6);
}
.dashboard-card-label {
  color: var(--text-subtitle, #475569);
  font-size: 1.01rem;
  font-weight: 500;
  display: block;
  max-width: 110px;
}
.dashboard-card-value {
  color: var(--text-accent, #151922);
  font-size: 1.88rem;
  font-weight: 700;
  margin-left: 1px;
  display: block;
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

/* Painéis principais */
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
  background: var(--bg-card, #fff);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main, 0 2px 24px #0001);
  padding: 1.35rem 1.1rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  color: var(--text-accent, #151922);
}

/* Lista de alertas */
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
  background: var(--bg-main, #f9fafe);
  font-size: 1rem;
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
  background: var(--bg-input, #eee);
  border: 1.2px solid transparent;
}
.badge-urgente { background: #e74848; color: #fff; }
.badge-alta { background: #edb440; color: #312806;}
.badge-media { background: #5aa7db; color: #16314c;}
.badge-baixa { background: #a3e3cb; color: #054c37;}
.alert-equip { color: var(--text-accent,#151922); font-weight: 700; margin-right: 6px; }
.alert-desc { flex: 1 1 auto; min-width: 0; word-break: break-word; color: var(--text-main,#313a44); }
.alert-date { font-size: 0.96em; color: var(--text-label,#64748b); margin-left: 7px; white-space: nowrap; }

/* Próximas manutenções */
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
  color: var(--text-main,#313a44);
  word-break: break-word;
  max-width: 125px;
}
.dashboard-table th {
  background: var(--bg-input,#eee);
  color: var(--text-accent,#151922);
  font-weight: 700;
  border-bottom: 2px solid var(--card-border,#e5e7eb);
  font-size: 1.05rem;
}
.dashboard-table td { border-bottom: 1px solid var(--card-border,#e5e7eb); }
.badge.status-badge {
  background: var(--bg-input,#eee);
  color: var(--btn-bg-hover,#3b82f6);
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
.sector-item {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  min-width: 0;
}
.sector-label {
  min-width: 75px;
  font-weight: 600;
  color: var(--text-main,#313a44);
}
.sector-bar-wrapper {
  flex: 1 1 auto;
  background: var(--bg-input, #eee);
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
  background: linear-gradient(90deg, var(--btn-bg-hover,#3b82f6) 70%, var(--btn-bg,#dbeafe) 100%);
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s;
}
.sector-percent {
  position: absolute;
  right: 9px;
  color: var(--text-main,#313a44);
  font-size: 0.97em;
  font-weight: 600;
}

/* Responsivo */
@media (max-width: 1100px) {
  .dashboard-panel--alertas, .dashboard-panel--prox { min-width: 150px; }
}
@media (max-width: 900px) {
  .dashboard { padding: 1.2rem 0.2rem; }
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