<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { MachineProfile, SensorProfile, MachineCreatePayload } from '@/configs/types'
import axiosInstance from '@/api/axiosConfig'

const machines = ref<MachineProfile[]>([])
const isLoading = ref(true)
const search = ref('')
const showCreateModal = ref(false)
const allSensores = ref<SensorProfile[]>([])

const createStep = ref(1)

// Labels e ícones para os tipos de sensor
const sensorTypeLabels: Record<SensorProfile['type'], string> = {
  TEMPERATURE: 'Temperatura',
  HUMIDITY: 'Umidade',
  PRESSURE: 'Pressão',
  OPENDOOR: 'Porta',
  VOLTAGE: 'Voltagem'
}
const sensorTypeIcons: Record<SensorProfile['type'], string> = {
  TEMPERATURE: 'fa-thermometer-half',
  HUMIDITY:    'fa-water',
  PRESSURE:    'fa-gauge-high',
  OPENDOOR:    'fa-door-open',
  VOLTAGE:     'fa-bolt'
}

// Busca na API
async function fetchMachines() {
  isLoading.value = true
  try {
    const resp = await axiosInstance.get<MachineProfile[]>('/maquinas')
    // Garante sempre sensores como array vazio se não vier do backend
    machines.value = resp.data.map(m =>
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

const filteredMachines = computed(() => {
  if (!search.value) return machines.value
  const term = search.value.toLowerCase()
  return machines.value.filter(m =>
    m.name.toLowerCase().includes(term) ||
    m.description.toLowerCase().includes(term)
  )
})

function faixa(valor: number | null | undefined, variacao: number | null | undefined, unidade = ''): string {
  if (valor == null || variacao == null) return '-'
  return `${valor - variacao}${unidade} ~ ${valor + variacao}${unidade}`
}

function sensorIcons(machine: MachineProfile) {
  if (!Array.isArray(machine.sensores) || !machine.sensores.length) return []
  return machine.sensores.map(s => ({
    type: s.type,
    icon: sensorTypeIcons[s.type],
    tooltip: `${s.name} (${sensorTypeLabels[s.type]})`
  }))
}

// Controle do modal multi-etapa
function nextStep() { createStep.value = 2 }
function prevStep() { createStep.value = 1 }

function openCreateModal() {
  showCreateModal.value = true
  createStep.value = 1
  fetchSensores()
  Object.assign(createForm.value, {
    name: '', description: '', sensores: [],
    tensaoPadrao: 0, tensaoVariacao: 0,
    temperaturaPadrao: 0, temperaturaVariacao: 0,
    pressaoPadrao: 0, pressaoVariacao: 0,
    humidadePadrao: 0, humidadeVariacao: 0
  })
}

function closeCreateModal() {
  showCreateModal.value = false
  createStep.value = 1
}

// Atenção: sensores agora é number[] (array de ID)
const createForm = ref<MachineCreatePayload>({
  name: '', description: '',
  tensaoPadrao: 0, tensaoVariacao: 0,
  temperaturaPadrao: 0, temperaturaVariacao: 0,
  pressaoPadrao: 0, pressaoVariacao: 0,
  humidadePadrao: 0, humidadeVariacao: 0,
  sensores: []
})

async function submitCreate() {
  try {
    // Valida dados mínimos (por etapa)
    if (createStep.value === 1) {
      // Etapa 1: pode customizar ou fazer focus-to-next campo inválido
      nextStep()
      return
    }
    // Etapa 2: salvar
    await axiosInstance.post('/maquinas', createForm.value)
    closeCreateModal()
    await fetchMachines()
  } catch (error) {
    alert('Erro ao criar máquina: ' + error)
  }
}

function editMachine(machine: MachineProfile) {
  alert(`Editar máquina: ${machine.name}`)
}
</script>

<template>
  <section class="machines-management">
    <div class="machines-management-bar">
      <h2 class="machines-title">Equipamentos</h2>
      <div class="machines-actions">
        <input
          v-model="search"
          placeholder="Buscar equipamento"
          class="machines-search"
          type="search"
        />
        <button class="machines-add-btn" @click="openCreateModal">
          <i class="fa fa-plus"></i>
          Novo Equipamento
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="loading-text">Carregando...</div>
    <div v-else class="machines-table-wrapper">
      <table class="machines-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Tensão (V)</th>
            <th>Temperatura (°C)</th>
            <th>Pressão (bar)</th>
            <th>Umidade (%)</th>
            <th>Sensores</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="machine in filteredMachines" :key="machine.id">
            <td>{{ machine.name }}</td>
            <td>{{ machine.description }}</td>
            <td>
              <div>
                <span>Padrão: {{ machine.tensaoPadrao }}V</span><br/>
                <span>Faixa: {{ faixa(machine.tensaoPadrao, machine.tensaoVariacao, 'V') }}</span>
              </div>
            </td>
            <td>
              <div>
                <span>Padrão: {{ machine.temperaturaPadrao }}°C</span><br/>
                <span>Faixa: {{ faixa(machine.temperaturaPadrao, machine.temperaturaVariacao, '°C') }}</span>
              </div>
            </td>
            <td>
              <div>
                <span>Padrão: {{ machine.pressaoPadrao }}bar</span><br/>
                <span>Faixa: {{ faixa(machine.pressaoPadrao, machine.pressaoVariacao, 'bar') }}</span>
              </div>
            </td>
            <td>
              <div>
                <span>Padrão: {{ machine.humidadePadrao }}%</span><br/>
                <span>Faixa: {{ faixa(machine.humidadePadrao, machine.humidadeVariacao, '%') }}</span>
              </div>
            </td>
            <td>
              <span
                v-for="icon in sensorIcons(machine)"
                :key="icon.icon + icon.type"
                class="machine-sensor-icon"
                :title="icon.tooltip">
                <i :class="['fas', icon.icon]"></i>
              </span>
              <span v-if="!machine.sensores || machine.sensores.length === 0">-</span>
            </td>
            <td>
              <button class="machines-edit-btn" @click="editMachine(machine)">
                <i class="fa fa-edit"></i> Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Step-by-step Criação Máquina -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content">
        <h3 class="modal-title">Novo Equipamento</h3>
        <form @submit.prevent="submitCreate">
          <!-- Etapa 1: dados básicos -->
          <template v-if="createStep === 1">
            <label>Nome
              <input v-model="createForm.name" required />
            </label>
            <label>Descrição
              <input v-model="createForm.description" required />
            </label>
            <label>Sensores Associados
              <select v-model="createForm.sensores" multiple>
                <option v-for="s in allSensores" :key="s.id" :value="s.id">
                  {{ s.name }} ({{ sensorTypeLabels[s.type] }})
                </option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="button" class="modal-cancel" @click="closeCreateModal">Cancelar</button>
              <button type="button" class="modal-save" @click="nextStep">
                Próximo &rarr;
              </button>
            </div>
          </template>
          <!-- Etapa 2: métricas e faixas -->
          <template v-else>
            <label>Tensão Padrão (V)
              <input v-model.number="createForm.tensaoPadrao" type="number" required min="0" />
            </label>
            <label>Variação Segura de Tensão (V)
              <input v-model.number="createForm.tensaoVariacao" type="number" required min="0" />
            </label>
            <label>Temperatura Padrão (°C)
              <input v-model.number="createForm.temperaturaPadrao" type="number" required />
            </label>
            <label>Variação Segura de Temperatura (°C)
              <input v-model.number="createForm.temperaturaVariacao" type="number" required />
            </label>
            <label>Pressão Padrão (bar)
              <input v-model.number="createForm.pressaoPadrao" type="number" required />
            </label>
            <label>Variação Segura de Pressão (bar)
              <input v-model.number="createForm.pressaoVariacao" type="number" required />
            </label>
            <label>Umidade Padrão (%)
              <input v-model.number="createForm.humidadePadrao" type="number" required min="0" max="100" />
            </label>
            <label>Variação Segura de Umidade (%)
              <input v-model.number="createForm.humidadeVariacao" type="number" required min="0" max="100" />
            </label>
            <div class="modal-actions">
              <button type="button" class="modal-cancel" @click="prevStep">&larr; Voltar</button>
              <button type="submit" class="modal-save">
                <i class="fa fa-plus"></i> Criar Equipamento
              </button>
            </div>
          </template>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.machines-management {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.4rem auto;
  padding: 1.9rem 1.3rem 0 1.3rem;
  box-sizing: border-box;
}
.machines-management-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
}
.machines-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-accent);
  margin: 0;
}
.machines-actions {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.machines-search {
  padding: 0.47em 1em;
  border-radius: 8px;
  border: 1.5px solid var(--input-border);
  font-size: 1.05rem;
  background: var(--bg-input);
  color: var(--text-main);
  outline: none;
  box-shadow: none;
  transition: border 0.14s;
}
.machines-search:focus {
  border: 1.5px solid var(--input-border-focus);
}
.machines-add-btn {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 1.2em;
  border-radius: 8px;
  background: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  font-size: 1.0rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, transform 0.11s;
  box-shadow: 0 2px 8px var(--btn-bg)21;
}
.machines-add-btn i {
  font-size: 1.10em;
}
.machines-add-btn:hover {
  background: var(--btn-bg-hover);
  transform: translateY(-2px) scale(1.04);
}
.machines-table-wrapper {
  overflow-x: auto;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--box-shadow-main);
  border: 1px solid var(--card-border);
  margin-top: 0.9rem;
}
.machines-table {
  min-width: 800px;
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}
.machines-table th,
.machines-table td {
  padding: 14px 13px;
  font-size: 1rem;
  text-align: left;
  color: var(--text-main);
  vertical-align: top;
}
.machines-table th {
  background: var(--bg-input);
  color: var(--text-accent);
  font-weight: 700;
  border-bottom: 2px solid var(--card-border);
}
.machines-table tr:not(:last-child) td {
  border-bottom: 1px solid var(--card-border);
}
.machines-edit-btn {
  background: none;
  color: var(--text-accent);
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4em;
  cursor: pointer;
  border-radius: 7px;
  padding: 5px 7px;
  transition: background 0.15s, color 0.13s;
}
.machines-edit-btn i {
  font-size: 1.07em;
}
.machines-edit-btn:hover {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
}
.machines-table td div {
  line-height: 1.2;
  margin-bottom: 2px;
  margin-top: 2px;
}
.machine-sensor-icon {
  margin-right: 4px;
  font-size: 1.16em;
  color: var(--btn-bg-hover);
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.13s;
}
.machine-sensor-icon:last-child {
  margin-right: 0;
}
.loading-text {
  text-align: center;
  color: var(--text-accent);
  padding: 2rem 0;
  font-size: 1.2em;
}

/* MODAL Step-by-step */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.18);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: var(--bg-card);
  border-radius: 18px;
  min-width: 325px;
  max-width: 98vw;
  padding: 2rem 1.6rem 1rem 1.6rem;
  box-shadow: 0 6px 28px #0002;
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.modal-title {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-accent);
  font-weight: 600;
  margin-bottom: -2px;
}
.modal-content label {
  font-size: 1.03rem;
  color: var(--text-label);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 0.22rem;
}
.modal-content input,
.modal-content select {
  padding: 0.51em 1em;
  border-radius: 8px;
  border: 1.5px solid var(--input-border);
  font-size: 1rem;
  background: var(--bg-input);
  color: var(--text-main);
  outline: none;
  transition: border 0.14s;
  margin-top: 0.07rem;
}
.modal-content input:focus,
.modal-content select:focus {
  border: 1.5px solid var(--input-border-focus);
}
.modal-content select {
  min-height: 2.2em;
}
.modal-actions {
  margin-top: 1.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.9rem;
}
.modal-cancel {
  background: none;
  color: var(--text-accent);
  border: none;
  font-size: 1.01rem;
  padding: 0.3em 0.65em;
  cursor: pointer;
  border-radius: 7px;
  font-weight: 600;
  transition: background 0.16s;
}
.modal-cancel:hover {
  background: var(--bg-input);
}
.modal-save {
  display: flex;
  align-items: center;
  gap: 0.61em;
  background: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  font-size: 1.03rem;
  padding: 0.39em 1em;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s, transform 0.11s;
}
.modal-save:hover {
  background: var(--btn-bg-hover);
  transform: scale(1.04);
}

@media (max-width: 900px) {
  .machines-management {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
  .machines-table {
    min-width: 480px;
  }
  .modal-content {
    min-width: 200px;
    padding: 1.2rem 0.7rem 0.7rem 0.7rem;
  }
}
@media (max-width: 600px) {
  .machines-management-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
  .machines-title {
    text-align: left;
    margin-bottom: 3px;
  }
  .machines-actions {
    flex-direction: column;
    gap: 9px;
    align-items: stretch;
  }
  .machines-table-wrapper {
    padding: 0;
  }
  .machines-table th,
  .machines-table td {
    font-size: 0.97rem;
    padding: 10px 4px;
  }
  .modal-content {
    min-width: 120px;
    padding: 0.8rem 0.3rem 0.6rem 0.3rem;
  }
}
</style>