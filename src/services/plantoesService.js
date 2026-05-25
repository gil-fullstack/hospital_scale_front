import http from '../http/index.js'

/**
 * Busca a escala semanal a partir de uma data de início.
 * @param {string} dataInicio - Formato YYYY-MM-DD (segunda-feira da semana)
 * @returns {Promise<Object>}
 */
export async function buscarEscalaSemanal(dataInicio) {
  const response = await http.get('/api/plantoes/semana', {
    params: { dataInicio },
  })
  return response.data
}

/**
 * Agenda um novo plantão.
 * @param {{ profissionalId: number, data: string, turno: string }} dados
 * @returns {Promise<Object>}
 */
export async function agendarPlantao(dados) {
  const response = await http.post('/api/plantoes', dados)
  return response.data
}

/**
 * Exclui um plantão pelo ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function excluirPlantao(id) {
  await http.delete(`/api/plantoes/${id}`)
}
