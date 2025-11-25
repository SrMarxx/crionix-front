<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { UserProfile, UserCreatePayload, UserUpdateDTO } from '@/configs/types'
import axiosInstance from '@/api/axiosConfig'

const users: Ref<UserProfile[]> = ref([])
const isLoading: Ref<boolean> = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const createForm = ref<UserCreatePayload>({
  name: '',
  cpf: '',
  nascimento: '',
  email: '',
  cargo: 'COLABORADOR'
})
const editForm = ref<UserUpdateDTO>({
  name: '',
  email: ''
})
const editingUserId = ref<string|null>(null)
const formError = ref<string|null>(null)
const editError = ref<string|null>(null)
const search = ref('')

const cargoOptions = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'COLABORADOR', label: 'Colaborador' }
]

function formatBRDate(dateStr: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

async function fetchUsers() {
  isLoading.value = true
  try {
    const response = await axiosInstance.get<UserProfile[]>('/users')
    users.value = response.data
  } finally {
    isLoading.value = false
  }
}
fetchUsers()

function openCreateModal() {
  showCreateModal.value = true
  Object.assign(createForm.value, {
    name: '',
    cpf: '',
    nascimento: '',
    email: '',
    cargo: 'COLABORADOR'
  })
  formError.value = null
}
function closeCreateModal() {
  showCreateModal.value = false
  formError.value = null
}

async function submitCreate() {
  formError.value = null
  if (
    !createForm.value.name.trim() ||
    !createForm.value.cpf.trim() ||
    !createForm.value.nascimento ||
    !createForm.value.email.trim() ||
    !createForm.value.cargo
  ) {
    formError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  try {
    await axiosInstance.post('/users', createForm.value)
    closeCreateModal()
    await fetchUsers()
  } catch (err: unknown) {
    if (err instanceof Error) {
      formError.value = err.message
      console.error('Mensagem de erro:', err.message);
    } else {
      formError.value = 'Erro desconhecido'
      console.error('Erro desconhecido:', err);
    }
  }
}

// EDITAÇÃO
function openEditModal(user: UserProfile) {
  editingUserId.value = user.userId
  editForm.value = { name: user.name, email: user.email }
  showEditModal.value = true
  editError.value = null
}
function closeEditModal() {
  showEditModal.value = false
  editError.value = null
  editingUserId.value = null
}
async function submitEdit() {
  editError.value = null
  if (!editForm.value.name.trim() || !editForm.value.email.trim()) {
    editError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  try {
    await axiosInstance.patch(`/users/${editingUserId.value}`, editForm.value)
    closeEditModal()
    await fetchUsers()
  } catch (err: unknown) {
    if (err instanceof Error) {
      editError.value = err.message
      console.error('Mensagem de erro:', err.message)
    } else {
      editError.value = 'Erro desconhecido ao editar usuário.'
      console.error('Erro desconhecido:', err)
    }
  }
}

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const term = search.value.toLowerCase()
  return users.value.filter(u =>
    u.name.toLowerCase().includes(term) ||
    u.email.toLowerCase().includes(term) ||
    u.cargo.toLowerCase().includes(term)
  )
})
</script>

<template>
<section class="users-management">
  <div class="users-management-bar">
    <h2 class="users-title">Usuários do Sistema</h2>
    <div class="users-actions">
      <input
        v-model="search"
        placeholder="Buscar usuário"
        class="users-search"
        type="search"
      />
      <button class="users-add-btn" @click="openCreateModal">
        <i class="fa fa-user-plus"></i>
        Novo Usuário
      </button>
    </div>
  </div>
  <div v-if="isLoading" class="loading-text">Carregando...</div>
  <div v-else class="users-table-wrapper">
    <table class="users-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Cargo</th>
          <th>Matrícula</th>
          <th>Nascimento</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.userId">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.cargo }}</td>
          <td>{{ user.matricula }}</td>
          <td>{{ formatBRDate(user.nascimento) }}</td>
          <td>
            <button class="users-edit-btn" @click="openEditModal(user)">
              <i class="fa fa-edit"></i> Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal Criação Usuário -->
  <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
    <div class="modal-content">
      <h3 class="modal-title">Novo Usuário</h3>
      <form @submit.prevent="submitCreate" autocomplete="off">
        <label>Nome
          <input v-model="createForm.name" autocomplete="off" required />
        </label>
        <label>CPF
          <input v-model="createForm.cpf" autocomplete="off" required maxlength="14" />
        </label>
        <label>Nascimento
          <input v-model="createForm.nascimento" type="date" required />
        </label>
        <label>E-mail
          <input v-model="createForm.email" type="email" autocomplete="off" required />
        </label>
        <label>Cargo
          <select v-model="createForm.cargo" required>
            <option
              v-for="opt in cargoOptions"
              :key="opt.value"
              :value="opt.value"
            >{{ opt.label }}</option>
          </select>
        </label>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="closeCreateModal">Cancelar</button>
          <button type="submit" class="modal-save">
            <i class="fa fa-user-plus"></i> Criar Usuário
          </button>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
      </form>
    </div>
  </div>

  <!-- Modal Edição Usuário -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
    <div class="modal-content">
      <h3 class="modal-title">Editar Usuário</h3>
      <form @submit.prevent="submitEdit" autocomplete="off">
        <label>Nome
          <input v-model="editForm.name" autocomplete="off" required />
        </label>
        <label>E-mail
          <input v-model="editForm.email" type="email" autocomplete="off" required />
        </label>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="closeEditModal">Cancelar</button>
          <button type="submit" class="modal-save">
            <i class="fa fa-save"></i> Salvar Alterações
          </button>
        </div>
        <p v-if="editError" class="form-error">{{ editError }}</p>
      </form>
    </div>
  </div>
</section>
</template>


<style scoped>
.users-management {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.4rem auto;
  padding: 1.9rem 1.3rem 0 1.3rem;
  box-sizing: border-box;
}
.users-management-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
}
.users-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-accent);
  margin: 0;
}
.users-actions {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.users-search {
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
.users-search:focus {
  border: 1.5px solid var(--input-border-focus);
}
.users-add-btn {
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
.users-add-btn i {
  font-size: 1.10em;
}
.users-add-btn:hover {
  background: var(--btn-bg-hover);
  transform: translateY(-2px) scale(1.04);
}
.users-table-wrapper {
  overflow-x: auto;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--box-shadow-main);
  border: 1px solid var(--card-border);
  margin-top: 0.9rem;
}
.users-table {
  min-width: 650px;
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}
.users-table th,
.users-table td {
  padding: 14px 13px;
  font-size: 1rem;
  text-align: left;
  color: var(--text-main);
}
.users-table th {
  background: var(--bg-input);
  color: var(--text-accent);
  font-weight: 700;
  border-bottom: 2px solid var(--card-border);
}
.users-table tr:not(:last-child) td {
  border-bottom: 1px solid var(--card-border);
}
.users-edit-btn {
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
.users-edit-btn i {
  font-size: 1.07em;
}
.users-edit-btn:hover {
  background: var(--bg-input);
  color: var(--btn-bg-hover);
}
/* MODAL */
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
.loading-text {
  text-align: center;
  color: var(--text-accent);
  padding: 2rem 0;
  font-size: 1.2em;
}
/* Responsivo em telas menores */
@media (max-width: 900px) {
  .users-management {
    padding-right: 0.3rem;
    padding-left: 0.3rem;
  }
  .users-table {
    min-width: 350px;
  }
}
@media (max-width: 600px) {
  .users-management-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
  .users-title {
    text-align: left;
    margin-bottom: 3px;
  }
  .users-actions {
    flex-direction: column;
    gap: 9px;
    align-items: stretch;
  }
  .users-table-wrapper {
    padding: 0;
  }
  .users-table th,
  .users-table td {
    font-size: 0.97rem;
    padding: 11px 7px;
  }
}
</style>