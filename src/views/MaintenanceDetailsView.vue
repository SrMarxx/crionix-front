<script setup lang="ts">
import type { ManutencaoResponseDTO, ManutencaoConclusaoDTO, ManutencaoRequestDTO } from '@/configs/types'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/api/axiosConfig'

// Roteamento
const route = useRoute()
const router = useRouter()
const id = route.params.id

// Estado da manutenção
const isLoading = ref(false)
const manutencao = ref<ManutencaoResponseDTO | null>(null)
const errorMessage = ref('')

// Estado botão/modal de conclusão
const showConclusaoForm = ref(false)
const conclusaoLoading = ref(false)
const conclusaoError = ref('')
const conclusaoSuccess = ref('')
const conclusaoForm = ref<ManutencaoConclusaoDTO>({
  conclusao: 'SUCESSO',
  relatorio: ''
})

// Estado botão/modal de edição
const showEditForm = ref(false)
const editLoading = ref(false)
const editError = ref('')
const editSuccess = ref('')
const editForm = ref<Partial<ManutencaoRequestDTO>>({})

// Carregar detalhes
async function fetchDetalhes() {
  isLoading.value = true
  try {
    const response = await axiosInstance.get<ManutencaoResponseDTO>(`/manutencao/${id}`)
    manutencao.value = response.data
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados das manutenções.'
    manutencao.value = null
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDetalhes)

// Botão/ação voltar
function voltar() {
  router.back()
}

// Modal de conclusão
function abrirConclusao() {
  showConclusaoForm.value = true
  conclusaoForm.value = { conclusao: 'SUCESSO', relatorio: '' }
  conclusaoSuccess.value = ''
  conclusaoError.value = ''
}
function fecharConclusao() {
  showConclusaoForm.value = false
}
// Enviar conclusão (POST)
async function enviarConclusao() {
  conclusaoLoading.value = true
  conclusaoError.value = ''
  conclusaoSuccess.value = ''
  try {
    await axiosInstance.post(`/manutencao/${id}`, conclusaoForm.value)
    conclusaoSuccess.value = 'Manutenção concluída com sucesso.'
    fecharConclusao()
    await fetchDetalhes()
  } catch (error) {
    conclusaoError.value = 'Falha ao concluir manutenção.'
    console.error(error)
  } finally {
    conclusaoLoading.value = false
  }
}

// Modal de edição
function abrirEdicao() {
  showEditForm.value = true
  editForm.value = {}
  editSuccess.value = ''
  editError.value = ''
}
function fecharEdicao() {
  showEditForm.value = false
}
// Enviar alteração/edição (PATCH)
async function enviarEdicao() {
  editLoading.value = true
  editError.value = ''
  editSuccess.value = ''
  try {
    await axiosInstance.patch(`/manutencao/${id}`, editForm.value)
    editSuccess.value = 'Manutenção alterada com sucesso.'
    fecharEdicao()
    await fetchDetalhes()
  } catch (error) {
    editError.value = 'Falha ao atualizar manutenção.'
    console.error(error)
  } finally {
    editLoading.value = false
  }
}

// Helpers visuais (iguais aos cards/lista)
function prioridadeClass(p: string) {
  switch (p) {
    case 'URGENTE': return 'badge-urgente'
    case 'ALTA': return 'badge-alta'
    case 'MEDIA': return 'badge-media'
    default: return 'badge-baixa'
  }
}
function tipoClass(t: string) {
  switch (t) {
    case 'PREVENTIVA': return 'badge-prev'
    case 'CORRETIVA': return 'badge-corr'
    case 'PREDITIVA': return 'badge-pred'
    default: return ''
  }
}
function conclusaoClass(c: string) {
  switch (c) {
    case 'SUCESSO': return 'badge-ok'
    case 'FALHA': return 'badge-falha'
    case 'ADIAMENTO': return 'badge-adia'
    default: return ''
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
function setorLabel(s: string) {
  switch (s) {
    case 'ACOUGUE': return 'Açougue'
    case 'PADARIA': return 'Padaria'
    case 'FRUTAS': return 'Frutas'
    case 'LATICINIOS': return 'Laticínios'
    default: return s
  }
}
function formatDate(data: string) {
  if (!data) return '-'
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>

<template>
  <section class="maint-details">
    <!-- Barra de ações superior -->
    <div class="details-actions">
      <button class="details-back-btn" @click="voltar">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
      <div class="actions-right">
        <button class="details-conclude-btn" @click="abrirConclusao">
          <i class="fas fa-check-circle"></i> Concluir
        </button>
        <button class="details-edit-btn" @click="abrirEdicao">
          <i class="fas fa-edit"></i> Editar
        </button>
      </div>
    </div>
    <h2 class="details-title">Detalhes da Manutenção</h2>

    <div v-if="isLoading" class="details-loading">
      Carregando...
    </div>
    <div v-else-if="errorMessage" class="details-error">
      {{ errorMessage }}
    </div>
    <div v-else-if="manutencao" class="details-card">
      <div class="details-block">
        <span class="details-label">ID:</span>
        <span class="details-value">{{ manutencao.id }}</span>
      </div>
      <div class="details-block">
        <span class="details-label">Equipamento:</span>
        <span class="details-value">{{ manutencao.maquina }}</span>
      </div>
      <div class="details-block">
        <span class="details-label">Setor:</span>
        <span class="details-value">{{ setorLabel(manutencao.setor) }}</span>
      </div>
      <div class="details-block">
        <span class="details-label">Responsável:</span>
        <span class="details-value">{{ manutencao.colaborador }}</span>
      </div>
      <div class="details-block">
        <span class="details-label">Tipo:</span>
        <span class="badge details-badge" :class="tipoClass(manutencao.tipo)">
          {{ manutencao.tipo }}
        </span>
      </div>
      <div class="details-block">
        <span class="details-label">Prioridade:</span>
        <span class="badge details-badge" :class="prioridadeClass(manutencao.prioridade)">
          {{ manutencao.prioridade }}
        </span>
      </div>
      <div class="details-block">
        <span class="details-label">Status:</span>
        <span class="badge details-badge" :class="statusClass(manutencao)">
          {{ manutencao.dataConclusao ? 'Concluída' : 'Agendada' }}
        </span>
      </div>
      <div class="details-block">
        <span class="details-label">Conclusão:</span>
        <span class="badge details-badge" :class="conclusaoClass(manutencao.conclusao)">
          {{ manutencao.conclusao ?? '-' }}
        </span>
      </div>
      <div class="details-block">
        <span class="details-label">Descrição:</span>
        <span class="details-value">{{ manutencao.descricao }}</span>
      </div>
      <div class="details-block">
        <span class="details-label">Relatório:</span>
        <span class="details-value">{{ manutencao.relatorio || '-' }}</span>
      </div>
      <div class="details-block-group">
        <div class="details-block">
          <span class="details-label">Criada em:</span>
          <span class="details-value">{{ formatDate(manutencao.dataCriacao) }}</span>
        </div>
        <div class="details-block">
          <span class="details-label">Limite:</span>
          <span class="details-value">{{ formatDate(manutencao.dataLimite) }}</span>
        </div>
        <div class="details-block">
          <span class="details-label">Concluída em:</span>
          <span class="details-value">{{ manutencao.dataConclusao ? formatDate(manutencao.dataConclusao) : '-' }}</span>
        </div>
      </div>
    </div>

    <!-- MODAL: CONCLUSÃO -->
    <div v-if="showConclusaoForm" class="modal-form">
      <div class="modal-bg" @click="fecharConclusao"></div>
      <form class="modal-content" @submit.prevent="enviarConclusao">
        <h3>Concluir manutenção</h3>
        <div class="form-row">
          <label>Conclusão:</label>
          <select v-model="conclusaoForm.conclusao" required>
            <option value="SUCESSO">Sucesso</option>
            <option value="FALHA">Falha</option>
            <option value="ADIAMENTO">Adiamento</option>
          </select>
        </div>
        <div class="form-row">
          <label>Relatório:</label>
          <textarea v-model="conclusaoForm.relatorio" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="modal-cancel" @click="fecharConclusao">Cancelar</button>
          <button type="submit" class="modal-confirm" :disabled="conclusaoLoading">
            <span v-if="conclusaoLoading">Enviando...</span>
            <span v-else>Concluir</span>
          </button>
        </div>
        <div v-if="conclusaoError" class="form-error">{{ conclusaoError }}</div>
        <div v-if="conclusaoSuccess" class="form-success">{{ conclusaoSuccess }}</div>
      </form>
    </div>

    <!-- MODAL: EDIÇÃO -->
    <div v-if="showEditForm" class="modal-form">
      <div class="modal-bg" @click="fecharEdicao"></div>
      <form class="modal-content" @submit.prevent="enviarEdicao">
        <h3>Editar manutenção</h3>
        <div class="form-row">
          <label>Máquina (ID):</label>
          <input v-model.number="editForm.maquina" type="number" min="1" />
        </div>
        <div class="form-row">
          <label>Colaborador (UUID):</label>
          <input v-model="editForm.colaborador" type="text" />
        </div>
        <div class="form-row">
          <label>Data Limite:</label>
          <input v-model="editForm.dataLimite" type="datetime-local" />
        </div>
        <div class="form-row">
          <label>Tipo:</label>
          <select v-model="editForm.tipo">
            <option value="">---</option>
            <option value="PREVENTIVA">Preventiva</option>
            <option value="CORRETIVA">Corretiva</option>
            <option value="PREDITIVA">Preditiva</option>
          </select>
        </div>
        <div class="form-row">
          <label>Prioridade:</label>
          <select v-model="editForm.prioridade">
            <option value="">---</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
        <div class="form-row">
          <label>Descrição:</label>
          <textarea v-model="editForm.descricao"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="modal-cancel" @click="fecharEdicao">Cancelar</button>
          <button type="submit" class="modal-confirm" :disabled="editLoading">
            <span v-if="editLoading">Enviando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
        <div v-if="editError" class="form-error">{{ editError }}</div>
        <div v-if="editSuccess" class="form-success">{{ editSuccess }}</div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.maint-details {
  max-width: 650px;
  margin: 0 auto 2.6rem auto;
  padding: 2.2rem 1.2rem 1.2rem 1.2rem;
  background: var(--bg-card, #fff);
  box-shadow: var(--box-shadow-main, 0 2px 24px #0003);
  border-radius: 13px;
}
.details-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.actions-right {
  display: flex; gap: 1rem;
}

/* Botões topo e modais */
.details-back-btn,
.details-conclude-btn,
.details-edit-btn {
  background: var(--btn-bg, #3089d5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6em 1.4em;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  transition: background 0.13s, box-shadow 0.13s;
}
.details-back-btn:hover,
.details-conclude-btn:hover,
.details-edit-btn:hover {
  background: #2563eb;
  box-shadow: 0 2px 18px #3089d53a;
}
.details-conclude-btn { background: #59c674; margin-right: 0.9rem; }
.details-conclude-btn:hover { background: #059669; }
.details-edit-btn { background: #fbbf24; color: #6c3c0c; }
.details-edit-btn:hover { background: #f59e1d; }
.details-back-btn i,
.details-conclude-btn i,
.details-edit-btn i { font-size: 1.07em; }

.details-title {
  font-size: 1.46rem;
  font-weight: 700;
  color: var(--text-accent, #151922);
  margin-bottom: 2.1rem;
  text-align: left;
}
.details-loading, .details-error {
  text-align: center;
  font-size: 1.08rem;
  margin: 2rem 0;
  color: var(--text-label, #64748b);
}
.details-error { color: red; }
.details-card {
  display: flex;
  flex-direction: column;
  gap: 1.12rem;
}
.details-block,
.details-block-group > .details-block {
  display: flex;
  align-items: center;
  gap: 0.93rem;
  font-size: 1.08rem;
  min-width: 0;
  flex-wrap: wrap;
}
.details-label {
  min-width: 112px;
  font-weight: 600;
  color: var(--text-label, #64748b);
}
.details-value {
  font-weight: 500;
  color: var(--text-main, #313a44);
  word-break: break-word;
}
.details-block-group {
  display: flex;
  gap: 1.3rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
}

/* Badges FrigoNix */
.badge.details-badge {
  font-size: 0.99rem;
  font-weight: 700;
  border-radius: 9px;
  padding: 4px 14px;
  display: inline-block;
}
.badge-urgente { background: #e74848; color: #fff; }
.badge-alta { background: #edb440; color: #312806; }
.badge-media { background: #5aa7db; color: #16314c; }
.badge-baixa { background: #a3e3cb; color: #054c37; }
.badge-prev { background: #e0f2fe; color: #2563eb; }
.badge-corr { background: #ffe8c8; color: #e49122; }
.badge-pred { background: #dcfce7; color: #059669; }
.badge-falha { background: #e74848; color: #fff; }
.badge-adia { background: #dedede; color: #333; }
.badge-ok { background: var(--bg-input, #eee); color: var(--btn-bg-hover, #3089d5);}
.badge-atrasada { background: #e74848; color: #fff; }
.badge-programada { background: var(--bg-input, #eee); color: var(--text-main, #313a44); }

/* Modais */
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
  .maint-details {
    padding: 1rem 0.4rem !important;
    max-width: 96vw;
    border-radius: 9px;
  }
  .details-title { font-size: 1.17rem; }
  .details-label { min-width: 80px; font-size: 1em;}
  .details-block-group { gap: 0.8rem; flex-direction: column;}
  .details-actions { flex-direction: column; gap: 0.6rem; align-items: stretch;}
  .actions-right { gap: 0.5rem; }
  .modal-content { padding: 1.1rem 0.3rem; max-width: 97vw; }
}
</style>