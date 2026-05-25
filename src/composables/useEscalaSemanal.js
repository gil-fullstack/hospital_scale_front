import { ref } from 'vue'
import {
  buscarEscalaSemanal,
  agendarPlantao,
  excluirPlantao,
} from '../services/plantoesService.js'

/**
 * Retorna a data da segunda-feira da semana atual no formato YYYY-MM-DD.
 */
function getSegundaFeiraAtual() {
  const hoje = new Date()
  const diaSemana = hoje.getDay() // 0 = domingo, 1 = segunda, ...
  const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana
  const segunda = new Date(hoje)
  segunda.setDate(hoje.getDate() + diffParaSegunda)
  return segunda.toISOString().slice(0, 10)
}

/**
 * Adiciona ou subtrai dias de uma string YYYY-MM-DD.
 * @param {string} dataStr
 * @param {number} dias
 * @returns {string}
 */
function adicionarDias(dataStr, dias) {
  const data = new Date(dataStr + 'T00:00:00')
  data.setDate(data.getDate() + dias)
  return data.toISOString().slice(0, 10)
}

export function useEscalaSemanal() {
  const escala = ref(null)
  const loading = ref(false)
  const erro = ref(null)
  const dataInicio = ref(getSegundaFeiraAtual())

  async function carregar() {
    loading.value = true
    erro.value = null
    try {
      escala.value = await buscarEscalaSemanal(dataInicio.value)
    } catch (e) {
      erro.value = e.message || 'Erro ao carregar escala semanal.'
    } finally {
      loading.value = false
    }
  }

  function semanaAnterior() {
    dataInicio.value = adicionarDias(dataInicio.value, -7)
    carregar()
  }

  function proximaSemana() {
    dataInicio.value = adicionarDias(dataInicio.value, 7)
    carregar()
  }

  /**
   * Agenda um plantão e recarrega a escala ao término.
   * Lança erro para o componente tratar.
   */
  async function agendar(dados) {
    const resultado = await agendarPlantao(dados)
    await carregar()
    return resultado
  }

  /**
   * Exclui um plantão e recarrega a escala ao término.
   * Lança erro para o componente tratar.
   */
  async function excluir(id) {
    await excluirPlantao(id)
    await carregar()
  }

  return {
    escala,
    loading,
    erro,
    dataInicio,
    carregar,
    semanaAnterior,
    proximaSemana,
    agendar,
    excluir,
  }
}
