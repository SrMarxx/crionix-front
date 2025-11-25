<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/api/axiosConfig'
import type { MachineProfile, SensorProfile } from '@/configs/types'

const equipamentos = ref<MachineProfile[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const allSensores = ref<SensorProfile[]>([])

// Busca lista de máquinas do backend
async function fetchMachines() {
  isLoading.value = true
  try {
    const resp = await axiosInstance.get<MachineProfile[]>('/maquinas')
    // Garante sempre sensores como array vazio se não vier do backend
    equipamentos.value = resp.data.map(m =>
      ({ ...m, sensores: Array.isArray(m.sensores) ? m.sensores : [] })
    )
  } catch (error) {
    console.error('Erro ao buscar máquinas:', error)
  } finally {
    isLoading.value = false
  }
}
async function fetchSensores() {
  try {
    const resp = await axiosInstance.get<SensorProfile[]>('/sensores')
    allSensores.value = resp.data
  } catch (error) {
    console.error('Erro ao buscar sensores:', error)
  }
}

// Inicialização
onMounted(() => {
  fetchMachines()
  fetchSensores()
})

// Helpers para visualização
function statusClass(machine: MachineProfile) {
  // Adapte conforme campos do backend, ou crie lógica por padrão/alerta
  // Exemplo: status ativo se não for nulo/inativo
  return machine.humidadePadrao != null ? 'badge-ativo' : 'badge-inativo'
}
function sensorIcon(t: string) {
  switch (t) {
    case 'TEMPERATURE': return 'fa-thermometer-half'
    case 'HUMIDITY': return 'fa-water'
    case 'PRESSURE': return 'fa-gauge-high'
    case 'OPENDOOR': return 'fa-door-open'
    case 'VOLTAGE': return 'fa-bolt'
    default: return 'fa-circle'
  }
}
function faixa(medida: number, variacao: number, unidade: string) {
  if (medida == null || variacao == null) return '-'
  return `${medida - variacao}${unidade} ~ ${medida + variacao}${unidade}`
}
</script>

<template>
  <section class="equipments">
    <h2 class="eq-title">Lista de Equipamentos</h2>
    <div v-if="isLoading" class="eq-loading">Carregando...</div>
    <div v-else-if="errorMessage" class="eq-error">{{ errorMessage }}</div>
    <div v-else class="eq-list">
      <router-link
        v-for="eq in equipamentos"
        :key="eq.id"
        class="eq-card-link"
        :to="`/equipments/${eq.id}`"
        tabindex="0"
        aria-label="Ver equipamento"
      >
        <div class="eq-card">
          <div class="eq-card-row">
            <span class="eq-nome">{{ eq.name }}</span>
            <span class="eq-setor">{{ eq.description ?? '-' }}</span>
          </div>
          <div class="eq-card-row eq-labels">
            <span class="eq-badge" :class="statusClass(eq)">
              {{ statusClass(eq) === 'badge-ativo' ? 'ATIVO' : 'INATIVO' }}
            </span>
            <span class="eq-tensao">
              {{ eq.tensaoPadrao }}V
            </span>
            <span class="eq-faixas">
              {{ faixa(eq.tensaoPadrao, eq.tensaoVariacao, 'V') }}
            </span>
            <span class="eq-sensores">
              <i v-for="s in eq.sensores" :key="s.type" :class="['fas', sensorIcon(s.type)]" :title="s.type"></i>
            </span>
          </div>
        </div>
      </router-link>
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
  background: var(--bg-main, #f9fafe);
}
.eq-title {
  font-size: 1.38rem;
  font-weight: 700;
  color: var(--text-accent, #151922);
  margin-bottom: 1.4rem;
  text-align: left;
}
.eq-loading, .eq-error {
  color: var(--text-label, #64748b);
  text-align: center;
  font-size: 1.09rem;
  margin: 2rem 0;
}
.eq-error { color: #d94646; }
.eq-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
}
.eq-card-link {
  display: block;
  width: 100%;
  min-width: 0;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 13px;
  transition: box-shadow 0.19s, transform 0.11s, border 0.11s;
}
.eq-card-link:focus .eq-card,
.eq-card-link:hover .eq-card {
  box-shadow: 0 4px 26px #3089d543;
  border: 1.9px solid var(--btn-bg, #3089d5);
  transform: scale(1.01) translateY(-2px);
}
.eq-card {
  background: var(--bg-card, #fff);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main, 0 2px 24px #0002);
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  width: 100%;
  min-width: 0;
  word-break: break-word;
  box-sizing: border-box;
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
  color: var(--text-main, #313a44);
  margin-right: 12px;
}
.eq-setor {
  font-size: 1.01rem;
  color: var(--text-label, #64748b);
  flex: 0 0 auto;
}
.eq-labels {
  gap: 0.67rem;
  margin-top: 3px;
  flex-wrap: wrap;
}
.eq-tipo, .eq-tensao, .eq-faixas {
  font-size: 0.97rem;
  color: var(--text-subtitle, #475569);
  background: var(--bg-input, #eee);
  border-radius: 7px;
  padding: 3px 10px;
  font-weight: 500;
}
.eq-sensores i {
  margin-right: 6px;
  font-size: 1.13rem;
  color: var(--btn-bg-hover, #3089d5);
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
  background: var(--bg-input, #eee);
  border: none;
}
.badge-ativo { background: #daf8e0; color: #33ad7a; }
.badge-manut { background: #ffe6b2; color: #d98c00; }
.badge-inativo { background: #ffe3e1; color: #cc3b25; }

@media (max-width: 700px) {
  .eq-title { font-size: 1.09rem; }
  .eq-card-row { flex-direction: column; align-items: flex-start; gap: 0.35rem;}
  .eq-labels { gap: 0.37rem; }
  .eq-card { padding: 1rem 0.55rem; }
}
</style>