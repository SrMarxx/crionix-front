<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/api/axiosConfig'
import type { MachineProfile, LeituraResponseDTO } from '@/configs/types'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const isLoading = ref(false)
const errorMessage = ref('')
const maquina = ref<MachineProfile | null>(null)
const leituras = ref<LeituraResponseDTO[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    const respMaquina = await axiosInstance.get(`/maquinas/${id}`)
    maquina.value = respMaquina.data
    const respLeituras = await axiosInstance.get(`/maquinas/leitura/${id}`)
    leituras.value = respLeituras.data
    errorMessage.value = ''
  } catch (err) {
    maquina.value = null
    leituras.value = []
    errorMessage.value = 'Erro ao carregar dados do equipamento.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

// Helper de faixa
function faixa(padrao: number, variacao: number, unidade: string) {
  if (padrao == null || variacao == null) return '-'
  return `${padrao - variacao} ~ ${padrao + variacao} ${unidade}`
}
function formatDate(date: string) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function sensorIcon(type: string) {
  switch (type) {
    case 'TEMPERATURE': return 'fa-thermometer-half'
    case 'HUMIDITY': return 'fa-water'
    case 'PRESSURE': return 'fa-gauge-high'
    case 'OPENDOOR': return 'fa-door-open'
    case 'VOLTAGE': return 'fa-bolt'
    default: return 'fa-circle'
  }
}
</script>
<template>
  <section class="machine-details">
    <button class="details-back-btn" @click="router.back()">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <h2 class="machine-title">Detalhes do Equipamento</h2>
    <div v-if="isLoading" class="machine-loading">Carregando...</div>
    <div v-else-if="errorMessage" class="machine-error">{{ errorMessage }}</div>
    <div v-else-if="maquina" class="machine-card">
      <div class="machine-block">
        <span class="machine-label">ID:</span>
        <span class="machine-value">{{ maquina.id }}</span>
      </div>
      <div class="machine-block">
        <span class="machine-label">Nome:</span>
        <span class="machine-value">{{ maquina.name }}</span>
      </div>
      <div class="machine-block">
        <span class="machine-label">Setor:</span>
        <span class="machine-value">{{ maquina.description }}</span>
      </div>
      <div class="machine-block-group">
        <div class="machine-block">
          <span class="machine-label">Tensão:</span>
          <span class="machine-value">{{ maquina.tensaoPadrao }} V (Faixa: {{ faixa(maquina.tensaoPadrao, maquina.tensaoVariacao, 'V') }})</span>
        </div>
        <div class="machine-block">
          <span class="machine-label">Temp.:</span>
          <span class="machine-value">{{ maquina.temperaturaPadrao }}°C (Faixa: {{ faixa(maquina.temperaturaPadrao, maquina.temperaturaVariacao, '°C') }})</span>
        </div>
        <div class="machine-block">
          <span class="machine-label">Pressão:</span>
          <span class="machine-value">{{ maquina.pressaoPadrao }}Pa (Faixa: {{ faixa(maquina.pressaoPadrao, maquina.pressaoVariacao, 'Pa') }})</span>
        </div>
        <div class="machine-block">
          <span class="machine-label">Humidade:</span>
          <span class="machine-value">{{ maquina.humidadePadrao }}% (Faixa: {{ faixa(maquina.humidadePadrao, maquina.humidadeVariacao, '%') }})</span>
        </div>
      </div>
      <div class="machine-block">
        <span class="machine-label">Sensores:</span>
        <span class="machine-sensores">
          <span v-for="s in maquina.sensores" :key="s.id" class="machine-sensor">
            <i :class="['fas', sensorIcon(s.type)]" :title="s.description || s.type"></i>
            {{ s.name }}
          </span>
        </span>
      </div>
      <div class="machine-leituras">
        <h3 class="machine-leitura-title">Leituras recentes</h3>
        <table class="machine-leitura-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in leituras" :key="l.id">
              <td>
                <i :class="['fas', sensorIcon(l.tipo)]"></i>
                {{ l.tipo }}
              </td>
              <td>{{ l.valor }}</td>
              <td>{{ formatDate(l.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.machine-details {
  max-width: 690px;
  margin: 0 auto 2.4rem auto;
  padding: 2.25rem 1rem 1.1rem 1rem;
  background: var(--bg-card, #fff);
  box-shadow: var(--box-shadow-main, 0 2px 22px #0002);
  border-radius: 14px;
}
.details-back-btn {
  background: var(--btn-bg, #3089d5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6em 1.4em;
  margin-bottom: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  transition: background 0.13s, box-shadow 0.13s;
}
.details-back-btn:hover {
  background: #2563eb;
  box-shadow: 0 2px 18px #3089d53a;
}
.details-back-btn i {
  font-size: 1.07em;
}
.machine-title {
  font-size: 1.33rem;
  font-weight: 700;
  color: var(--text-accent, #151922);
  margin-bottom: 1.6rem;
}
.machine-loading, .machine-error {
  color: var(--text-label, #64748b);
  text-align: center;
  font-size: 1.09rem;
  margin: 2rem 0;
}
.machine-error { color: #d94646;}
.machine-card {
  display: flex; flex-direction: column; gap: 1.08rem;
}
.machine-block {
  display: flex; align-items: center; gap: 0.98rem; font-size: 1.08rem; flex-wrap: wrap;
}
.machine-block-group {
  display: flex; gap: 1.08rem; margin-top: 0.8rem; flex-wrap: wrap;
}
.machine-label {
  min-width: 110px;
  font-weight: 600;
  color: var(--text-label, #64748b);
}
.machine-value {
  font-weight: 500;
  color: var(--text-main, #313a44);
  word-break: break-word;
}
.machine-sensores { display: flex; gap: 1.08rem; flex-wrap: wrap; }
.machine-sensor {
  display: flex; align-items: center; gap: 7px;
  background: var(--bg-input,#eee);
  border-radius: 7px;
  padding: 2.5px 12px;
  font-size: 0.98em;
  color: var(--btn-bg-hover,#3089d5);
  font-weight: 500;
}
.machine-sensor i { font-size: 1.13em; color: var(--btn-bg-hover,#3089d5);}
.machine-leituras {
  margin-top: 1.6rem;
}
.machine-leitura-title {
  font-size: 1.05rem;
  color: var(--text-accent, #151922);
  font-weight: 600;
  margin-bottom: 0.6rem;
}
.machine-leitura-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  background: transparent;
}
.machine-leitura-table th,
.machine-leitura-table td {
  padding: 8px 9px;
  text-align: left;
  color: var(--text-main, #313a44);
  border-bottom: 1px solid var(--card-border,#e5e7eb);
}
.machine-leitura-table th {
  background: var(--bg-input,#eee);
  color: var(--text-accent,#151922);
  font-weight: 700;
}
.machine-leitura-table td i { margin-right: 5px; color: var(--btn-bg-hover,#3089d5);}
@media (max-width: 700px) {
  .machine-title { font-size: 1.09rem; }
  .machine-block-group { gap: 0.4rem; flex-direction: column;}
  .machine-details { padding: 1.1rem 0.25rem; border-radius: 9px; }
  .machine-leitura-table th, .machine-leitura-table td { font-size: 0.95rem; padding: 6px 2px;}
}
</style>