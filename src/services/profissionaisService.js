import http from '../http/index.js'

/**
 * Lista profissionais, opcionalmente filtrando por categoria.
 * @param {string} [categoria] - 'MEDICO' | 'ENFERMEIRO' | 'TECNICO'
 * @returns {Promise<Array>}
 */
export async function listarProfissionais(categoria) {
  const params = categoria ? { categoria } : {}
  const response = await http.get('/api/profissionais', { params })
  return response.data
}

/**
 * Cadastra um novo profissional.
 * @param {{ nome: string, crm: string, categoria: string, cargaHorariaSemanal: number }} dados
 * @returns {Promise<Object>}
 */
export async function cadastrarProfissional(dados) {
  const response = await http.post('/api/profissionais', dados)
  return response.data
}
