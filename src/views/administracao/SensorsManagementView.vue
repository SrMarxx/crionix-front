<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SensorProfile, SensorCreatePayload } from '@/configs/types'
import axiosInstance from '@/api/axiosConfig'

const sensors = ref<SensorProfile[]>([])
const isLoading = ref(true)
const search = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const createForm = ref<SensorCreatePayload>({
  name: '',
  description: '',
  type: 'TEMPERATURE'
})
const editForm = ref<SensorCreatePayload>({
  name: '',
  description: '',
  type: 'TEMPERATURE'
})
const editingSensorId = ref<number|null>(null)

const formError = ref<string | null>(null)

const sensorTypeLabels: Record<SensorProfile['type'], string> = {
  TEMPERATURE: 'Temperatura',
  HUMIDITY: 'Umidade',
  PRESSURE: 'Pressão',
  OPENDOOR: 'Abertura Porta',
  VOLTAGE: 'Voltagem'
}

async function fetchSensors() {
  isLoading.value = true
  try {
    const response = await axiosInstance.get<SensorProfile[]>('/sensores')
    sensors.value = response.data
  } catch (err) {
    console.error('Erro ao buscar sensores:', err)
  } finally {
    isLoading.value = false
  }
}
onMounted(fetchSensors)

const filteredSensors = computed(() => {
  if (!search.value) return sensors.value
  const term = search.value.toLowerCase()
  return sensors.value.filter(sensor =>
    sensor.name.toLowerCase().includes(term) ||
    sensor.description.toLowerCase().includes(term) ||
    sensorTypeLabels[sensor.type].toLowerCase().includes(term)
  )
})

// Criação
function openCreateModal() {
  showCreateModal.value = true
  Object.assign(createForm.value, {
    name: '',
    description: '',
    type: 'TEMPERATURE'
  })
  formError.value = null
}
function closeCreateModal() {
  showCreateModal.value = false
  formError.value = null
}
async function submitCreate() {
  formError.value = null
  if (!createForm.value.name.trim() || !createForm.value.type) {
    formError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  try {
    await axiosInstance.post('/sensores', createForm.value)
    closeCreateModal()
    await fetchSensors()
  } catch (err) {
    formError.value = 'Erro ao criar sensor.'
    console.error(err)
  }
}

// Edição
function openEditModal(sensor: SensorProfile) {
  showEditModal.value = true
  editingSensorId.value = sensor.id
  Object.assign(editForm.value, {
    name: sensor.name,
    description: sensor.description,
    type: sensor.type
  })
  formError.value = null
}
function closeEditModal() {
  showEditModal.value = false
  editingSensorId.value = null
  formError.value = null
}
async function submitEdit() {
  formError.value = null
  if (!editForm.value.name.trim() || !editForm.value.type) {
    formError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  try {
    await axiosInstance.patch(`/sensores/${editingSensorId.value}`, editForm.value)
    closeEditModal()
    await fetchSensors()
  } catch (err) {
    formError.value = 'Erro ao atualizar sensor.'
    console.error(err)
  }
}
</script>

<template>
<section class="sensors-management">
  <div class="sensors-management-bar">
    <h2 class="sensors-title">Sensores</h2>
    <div class="sensors-actions">
      <input
        v-model="search"
        placeholder="Buscar sensor"
        class="sensors-search"
        type="search"
      />
      <button class="sensors-add-btn" @click="openCreateModal">
        <i class="fa fa-plus"></i>
        Novo Sensor
      </button>
    </div>
  </div>
  <div v-if="isLoading" class="loading-text">Carregando...</div>
  <div v-else class="sensors-table-wrapper">
    <table class="sensors-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Tipo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sensor in filteredSensors" :key="sensor.id">
          <td>{{ sensor.name }}</td>
          <td>{{ sensor.description }}</td>
          <td>
            <span class="sensor-type-label">{{ sensorTypeLabels[sensor.type] }}</span>
          </td>
          <td>
            <button class="sensors-edit-btn" @click="openEditModal(sensor)">
              <i class="fa fa-edit"></i> Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal: Criação de sensor -->
  <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
    <div class="modal-content">
      <h3 class="modal-title">Novo Sensor</h3>
      <form @submit.prevent="submitCreate">
        <label>Nome
          <input v-model="createForm.name" required />
        </label>
        <label>Descrição
          <input v-model="createForm.description" required />
        </label>
        <label>Tipo
          <select v-model="createForm.type" required>
            <option v-for="(label, typ) in sensorTypeLabels" :key="typ" :value="typ">
              {{ label }}
            </option>
          </select>
        </label>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="closeCreateModal">Cancelar</button>
          <button type="submit" class="modal-save">
            <i class="fa fa-save"></i> Salvar Sensor
          </button>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
      </form>
    </div>
  </div>
  <!-- Modal: Edição de sensor -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
    <div class="modal-content">
      <h3 class="modal-title">Editar Sensor</h3>
      <form @submit.prevent="submitEdit">
        <label>Nome
          <input v-model="editForm.name" required />
        </label>
        <label>Descrição
          <input v-model="editForm.description" required />
        </label>
        <label>Tipo
          <select v-model="editForm.type" required>
            <option v-for="(label, typ) in sensorTypeLabels" :key="typ" :value="typ">
              {{ label }}
            </option>
          </select>
        </label>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="closeEditModal">Cancelar</button>
          <button type="submit" class="modal-save">
            <i class="fa fa-save"></i> Salvar Alterações
          </button>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
      </form>
    </div>
  </div>
</section>
</template>

<style scoped>
.sensors-management {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 2.4rem auto;
  padding: 1.9rem 1.3rem 0 1.3rem;
  box-sizing: border-box;
}
.sensors-management-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
}
.sensors-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-accent);
  margin: 0;
}
.sensors-actions {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.sensors-search {
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
.sensors-search:focus {
  border: 1.5px solid var(--input-border-focus);
}
.sensors-add-btn {
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
.sensors-add-btn i {
  font-size: 1.10em;
}
.sensors-add-btn:hover {
  background: var(--btn-bg-hover);
  transform: translateY(-2px) scale(1.04);
}
.sensors-table-wrapper {
  overflow-x: auto;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--box-shadow-main);
  border: 1px solid var(--card-border);
}
.sensors-table {
  min-width: 520px;
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}
.sensors-table th,
.sensors-table td {
  padding: 14px 13px;
  font-size: 1rem;
  text-align: left;
  color: var(--text-main);
}
.sensors-table th {
  background: var(--bg-input);
  color: var(--text-accent);
  font-weight: 700;
  border-bottom: 2px solid var(--card-border);
}
.sensors-table tr:not(:last-child) td {
  border-bottom: 1px solid var(--card-border);
}
.sensors-edit-btn {
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
.sensors-edit-btn i {
  font-size: 1.07em;
}
.sensors-edit-btn:hover {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
}
.sensor-type-label {
  font-weight: 600;
  color: var(--btn-bg-hover);
  background: var(--bg-input);
  padding: 3px 19px;
  border-radius: 10px;
  display: inline-block;
}
.loading-text {
  text-align: center;
  color: var(--text-accent);
  padding: 2rem 0;
  font-size: 1.2em;
}

/* MODAL compartilhado para criar/editar */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.19);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: var(--bg-card);
  border-radius: 18px;
  min-width: 325px;
  max-width: 90vw;
  padding: 2.1rem 1.7rem 1.3rem 1.7rem;
  box-shadow: 0 6px 28px #0002;
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}
.modal-title {
  text-align: center;
  font-size: 1.25rem;
  color: var(--text-accent);
  font-weight: 600;
  margin-bottom: -6px;
}
.modal-content label {
  font-size: 1.06rem;
  color: var(--text-label);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 0.35rem;
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
.modal-actions {
  margin-top: 0.9rem;
  display: flex;
  justify-content: flex-end;
  gap: 1.1rem;
}
.modal-cancel {
  background: none;
  color: var(--text-accent);
  border: none;
  font-size: 1.03rem;
  padding: 0.3em 0.7em;
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
  gap: 0.67em;
  background: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  font-size: 1.04rem;
  padding: 0.38em 1em;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s, transform 0.11s;
}
.modal-save:hover {
  background: var(--btn-bg-hover);
  transform: scale(1.04);
}
.form-error {
  color: var(--text-error);
  font-size: 1.04em;
  margin-top: 1rem;
  text-align: center;
}

/* Responsivo */
@media (max-width: 900px) {
  .sensors-management {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
  .sensors-table {
    min-width: 320px;
  }
}
@media (max-width: 600px) {
  .sensors-management-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
  .sensors-title {
    text-align: left;
    margin-bottom: 3px;
  }
  .sensors-actions {
    flex-direction: column;
    gap: 9px;
    align-items: stretch;
  }
  .sensors-table-wrapper {
    padding: 0;
  }
  .sensors-table th,
  .sensors-table td {
    font-size: 0.97rem;
    padding: 11px 7px;
  }
  .modal-content {
    min-width: 240px;
    padding: 1.2rem 0.7rem 0.8rem 0.7rem;
  }
}
</style>