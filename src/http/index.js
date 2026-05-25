import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response

    if (response && response.data) {
      const data = response.data
      const normalized = {
        message: data.mensagem || data.erro || 'Erro inesperado.',
        detalhes: data.detalhes || [],
        status: data.status || response.status,
      }
      return Promise.reject(normalized)
    }

    return Promise.reject({
      message: 'Não foi possível conectar ao servidor.',
      detalhes: [],
      status: 0,
    })
  }
)

export default http
