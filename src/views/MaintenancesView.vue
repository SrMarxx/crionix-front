<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type {
  ManutencaoResponseDTO,
  ManutencaoRequestDTO,
  UserProfile,
  MachineProfile
} from '@/configs/types'
import axiosInstance from '@/api/axiosConfig'

// Estado da listagem e paginação
const manutencao = ref<ManutencaoResponseDTO[]>([])
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

// Estado do formulário/modal
const showForm = ref(false)
const usuarios = ref<UserProfile[]>([])
const maquinas = ref<MachineProfile[]>([])
const formLoading = ref(false)
const formError = ref('')
const formSuccess = ref('')

const form = ref<ManutencaoRequestDTO>({
  maquina: 0,
  colaborador: '',
  dataLimite: '',
  descricao: '',
  prioridade: 'MEDIA',
  tipo: 'PREVENTIVA'
})

// Buscar manutenções paginadas
async function fetchManutencoes() {
  isLoading.value = true
  try {
    const response = await axiosInstance.get('/manutencao', {
      params: { page: page.value, size: size.value }
    })
    manutencao.value = response.data.content ?? response.data
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados das manutenções.'
    manutencao.value = []
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function fetchTotalPaginas() {
  try{
    const response = await axiosInstance.get('/manutencao/pages')
    totalPages.value = response.data.totalPages ?? 1
  } catch (err){
    console.error(err)
  }
}

// Paginação
function proximaPagina() {
  if (page.value + 1 < totalPages.value) {
    page.value++
    fetchManutencoes()
  }
}
function paginaAnterior() {
  if (page.value > 0) {
    page.value--
    fetchManutencoes()
  }
}

// Buscar usuários para o select de colaborador
async function fetchUsuarios() {
  try {
    const resp = await axiosInstance.get('/users')
    usuarios.value = resp.data
  } catch (error) {
    usuarios.value = []
    console.error('Erro ao carregar usuários', error)
  }
}

// Buscar máquinas para o select
async function fetchMaquinas() {
  try {
    const resp = await axiosInstance.get('/maquinas')
    maquinas.value = resp.data
  } catch (error) {
    maquinas.value = []
    console.error('Erro ao carregar máquinas', error)
  }
}

// Modal: abrir/fechar
function abrirForm() {
  showForm.value = true
  formSuccess.value = ''
  formError.value = ''
  form.value = {
    maquina: 0,
    colaborador: '',
    dataLimite: '',
    descricao: '',
    prioridade: 'MEDIA',
    tipo: 'PREVENTIVA'
  }
}
function fecharForm() {
  showForm.value = false
}

// Enviar nova manutenção
async function enviarForm() {
  formLoading.value = true
  formError.value = ''
  formSuccess.value = ''

  // validações simples de front
  if (!form.value.maquina || form.value.maquina <= 0) {
    formError.value = 'Selecione uma máquina válida.'
    formLoading.value = false
    return
  }
  if (!form.value.colaborador) {
    formError.value = 'Selecione um colaborador.'
    formLoading.value = false
    return
  }

  try {
    await axiosInstance.post('/manutencao', form.value)
    formSuccess.value = 'Manutenção criada com sucesso.'
    await fetchManutencoes()
    fecharForm()
  } catch (error) {
    formError.value = 'Falha ao criar manutenção.'
    console.error(error)
  } finally {
    formLoading.value = false
  }
}

onMounted(async () => {
  await fetchManutencoes()
  await fetchUsuarios()
  await fetchMaquinas()
  await fetchTotalPaginas()
})

// Helpers de status/prioridade/card
function prioridadeClass(p: string) {
  switch (p) {
    case 'URGENTE': return 'badge-urgente'
    case 'ALTA': return 'badge-alta'
    case 'MEDIA': return 'badge-media'
    default: return 'badge-baixa'
  }
}
function statusClass(m: ManutencaoResponseDTO) {
  if (m.dataConclusao) return 'badge-ok'
  const limite = new Date(m.dataLimite)
  const agora = new Date()
  if (agora > limite) return 'badge-atrasada'
  if (!m.dataConclusao && limite > agora) return 'badge-programada'
  return 'badge-ok'
}
function formatDate(data: string) {
  if (!data) return '-'
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>

<template>
  <section class="maintenances">
    <h2 class="maint-title">Registros de Manutenções</h2>

    <!-- Botão de adicionar manutenção -->
    <button class="maint-add-btn" @click="abrirForm">
      <i class="fas fa-plus"></i> Nova manutenção
    </button>

    <div v-if="isLoading" class="maint-loading">
      Carregando...
    </div>
    <div v-else class="maint-list">
      <router-link
        v-for="mnt in manutencao"
        :key="mnt.id"
        class="maint-card-link"
        :to="`/maintenances/${mnt.id}`"
      >
        <div class="maint-card">
          <div class="maint-card-row">
            <span class="maint-equip">{{ mnt.maquina }}</span>
            <span class="maint-setor">{{ mnt.setor ?? '-' }}</span>
          </div>
          <div class="maint-card-row maint-card-labels">
            <span class="maint-badge" :class="prioridadeClass(mnt.prioridade)">
              {{ mnt.prioridade }}
            </span>
            <span class="maint-badge" :class="statusClass(mnt)">
              {{ mnt.dataConclusao ? 'Concluída' : 'Agendada' }}
            </span>
            <span class="maint-type">{{ mnt.tipo }}</span>
            <span class="maint-data">{{ formatDate(mnt.dataLimite) }}</span>
            <span class="maint-resp">{{ mnt.colaborador }}</span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Paginação -->
    <div class="pagination">
      <button :disabled="page === 0" @click="paginaAnterior">Página anterior</button>
      <span>Página {{ page + 1 }} de {{ totalPages }}</span>
      <button :disabled="page + 1 >= totalPages" @click="proximaPagina">Próxima página</button>
    </div>
    <div v-if="errorMessage" class="maint-error">{{ errorMessage }}</div>

    <!-- MODAL/FORM NOVA MANUTENÇÃO -->
    <div v-if="showForm" class="modal-form">
      <div class="modal-bg" @click="fecharForm"></div>
      <form class="modal-content" @submit.prevent="enviarForm">
        <h3>Criar Manutenção</h3>

        <div class="form-row">
          <label>Máquina/Equipamento (ID):</label>
          <select v-model="form.maquina" required>
            <option value="">Selecione...</option>
            <option v-for="m in maquinas" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>Colaborador:</label>
          <select v-model="form.colaborador" required>
            <option value="">Selecione...</option>
            <option v-for="u in usuarios" :key="u.userId" :value="u.userId">
              {{ u.name }} ({{ u.email }})
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>Data Limite:</label>
          <input v-model="form.dataLimite" required type="datetime-local" />
        </div>
        <div class="form-row">
          <label>Tipo:</label>
          <select v-model="form.tipo" required>
            <option value="PREVENTIVA">Preventiva</option>
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREDITIVA">Preditiva</option>
          </select>
        </div>
        <div class="form-row">
          <label>Prioridade:</label>
          <select v-model="form.prioridade" required>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
        <div class="form-row">
          <label>Descrição:</label>
          <textarea v-model="form.descricao" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="modal-cancel" @click="fecharForm">Cancelar</button>
          <button type="submit" class="modal-confirm" :disabled="formLoading">
            <span v-if="formLoading">Enviando...</span>
            <span v-else>Criar</span>
          </button>
        </div>
        <div v-if="formError" class="form-error">{{ formError }}</div>
        <div v-if="formSuccess" class="form-success">{{ formSuccess }}</div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.maintenances {
  max-width: 900px;
  margin: 0 auto 2.4rem;
  padding: 2.1rem 1.1rem 0 1.1rem;
  box-sizing: border-box;
  min-height: 100vh;
  background: var(--bg-main, #f9fafe);
}
.maint-title {
  font-size: 1.38rem;
  font-weight: 700;
  color: var(--text-accent, #151922);
  margin-bottom: 1.4rem;
  text-align: left;
}
.maint-add-btn {
  background: var(--btn-bg, #3089d5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.62em 1.35em;
  margin-bottom: 1.15rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.59em;
  transition: background 0.14s, box-shadow 0.16s;
}
.maint-add-btn:hover {
  background: #2563eb;
  box-shadow: 0 3px 22px #3089d52b;
}
.maint-add-btn i { font-size: 1.14em; }
.maint-loading {
  text-align: center;
  color: #999;
  font-size: 1.08rem;
  margin: 2rem 0;
}
.maint-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
/* Card link = bloco 100% seguro */
.maint-card-link {
  text-decoration: none;
  display: block;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.maint-card {
  background: var(--bg-card, #fff);
  border-radius: 13px;
  box-shadow: var(--box-shadow-main, 0 2px 24px #0002);
  padding: 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
  word-break: break-word;
  box-sizing: border-box;
  transition: box-shadow 0.18s, transform 0.13s, border 0.15s;
}
.maint-card-link .maint-card {
  cursor: pointer;
}
.maint-card-link .maint-card:hover {
  box-shadow: 0 4px 28px #3089d544;
  transform: translateY(-2px) scale(1.01);
  border: 1.5px solid var(--btn-bg, #3089d5);
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
  color: var(--text-main, #313a44);
  margin-right: 12px;
}
.maint-setor {
  font-size: 1rem;
  color: var(--text-label, #64748b);
}
.maint-card-labels {
  gap: 0.7rem;
  margin-top: 4px;
  flex-wrap: wrap;
}
.maint-type,
.maint-data,
.maint-resp {
  font-size: 0.98rem;
  color: var(--text-subtitle, #475569);
  background: var(--bg-input, #eee);
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
  background: var(--bg-input, #eee);
  border: none;
}
.badge-urgente { background: #e74848; color: #fff; }
.badge-alta { background: #edb440; color: #312806; }
.badge-media { background: #5aa7db; color: #16314c; }
.badge-baixa { background: #a3e3cb; color: #054c37; }
.badge-vencendo { background: #edb440; color: #313a06; }
.badge-atrasada { background: #e74848; color: #fff; }
.badge-programada { background: var(--bg-input, #eee); color: var(--text-main, #313a44); }
.badge-ok { background: var(--bg-input, #eee); color: var(--btn-bg-hover, #3089d5); }
.maint-error {
  color: red;
  text-align: center;
  font-size: 1rem;
  margin-top: 1rem;
}
/* PAGINAÇÃO */
.pagination {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 1.3rem;
  justify-content: center;
}
.pagination button {
  background: var(--btn-bg, #3089d5);
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.55em 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.13s;
}
.pagination button:disabled {
  background: #dbeafe;
  color: #888;
  cursor: not-allowed;
}
.pagination span {
  color: var(--text-label, #64748b);
}

/* MODAL FORMULÁRIO */
.modal-form {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.modal-bg {
  position: absolute;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: #101926cc;
  backdrop-filter: blur(2.5px);
}
.modal-content {
  position: relative;
  background: var(--bg-card, #fff);
  border-radius: 12px;
  box-shadow: 0 8px 28px #0005;
  padding: 2.2rem 1.6rem 1.15rem 1.6rem;
  width: 98vw; max-width: 420px;
  z-index: 2;
  display: flex; flex-direction: column; gap: 1.22rem;
}
.modal-content h3 {
  font-size: 1.19rem;
  color: var(--text-accent, #151922);
  font-weight: 700; margin-bottom: 0.4rem;
  text-align: left;
}
.form-row {
  display: flex; flex-direction: column;
  gap: 0.52rem; margin-bottom: 1.1rem;
}
.form-row label {
  font-weight: 600;
  color: var(--text-label, #64748b);
  font-size: 0.99rem;
}
.form-row input,
.form-row select,
.form-row textarea {
  background: var(--bg-input, #eee);
  border: 1.2px solid #dbeafe;
  border-radius: 7px;
  padding: 8px 9px; font-size: 1rem;
  color: var(--text-main, #313a44);
}
.form-row textarea { min-height: 58px; resize: vertical; }
.form-actions {
  display: flex; gap: 1.2rem;
  justify-content: flex-end; margin-top: 0.6rem;
}
.modal-confirm, .modal-cancel {
  padding: 0.39em 1.3em;
  border-radius: 7px;
  font-weight: 600; border: none;
  cursor: pointer;
  font-size: 1rem;
}
.modal-confirm {
  background: var(--btn-bg, #3089d5); color: #fff;
}
.modal-confirm:disabled { background: #dbeafe; color: #fff; cursor: not-allowed; }
.modal-cancel { background: #d94646; color: #fff; }
.form-error { color: #d94646; font-weight: 500; margin-top: 0.7rem; }
.form-success { color: #059669; font-weight: 500; margin-top: 0.7rem; }

@media (max-width: 700px) {
  .maint-title { font-size: 1.09rem; }
  .maint-card-row { flex-direction: column; align-items: flex-start; gap: 0.46rem;}
  .maint-card-labels { gap: 0.44rem; }
  .maint-card { padding: 1rem 0.6rem; }
  .modal-content { padding: 1.1rem 0.3rem; max-width: 97vw; }
}
</style>
