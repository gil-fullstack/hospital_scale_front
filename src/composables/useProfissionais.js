import { ref, watch } from 'vue'
import { listarProfissionais, cadastrarProfissional } from '../services/profissionaisService.js'

export function useProfissionais() {
  const profissionais = ref([])
  const loading = ref(false)
  const erro = ref(null)
  const filtroCategoria = ref('')

  async function carregar() {
    loading.value = true
    erro.value = null
    try {
      profissionais.value = await listarProfissionais(filtroCategoria.value || undefined)
    } catch (e) {
      erro.value = e.message || 'Erro ao carregar profissionais.'
    } finally {
      loading.value = false
    }
  }

  async function cadastrar(dados) {
    // Lança erro para o componente tratar inline
    const novo = await cadastrarProfissional(dados)
    await carregar()
    return novo
  }

  watch(filtroCategoria, () => {
    carregar()
  })

  return {
    profissionais,
    loading,
    erro,
    filtroCategoria,
    carregar,
    cadastrar,
  }
}
