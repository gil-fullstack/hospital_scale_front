---
name: axios-setup
description: Configura a instância Axios do projeto com interceptors de autenticação, tratamento centralizado de erros e retry automático. Cria a estrutura completa de http/ com arquivos separados por responsabilidade.
user-invocable: true
argument-hint: "[opcional: URL base da API, ex: https://api.hospital.com/v1]"
allowed-tools:
  - Read
  - Glob
  - Write
  - LS
---

# Axios Setup

Configure a instância Axios com interceptors completos.

URL base da API: **${ARGUMENTS:-import.meta.env.VITE_API_URL}**

## Verificação prévia

```!
ls /home/gilvan/tinellus/hospital_scale/src/http 2>/dev/null && echo "Diretório já existe" || echo "Criar src/http/"
cat /home/gilvan/tinellus/hospital_scale/package.json | grep -E '"axios"|"pinia"'
```

## Estrutura a criar

```
src/http/
  axios.ts                       # Instância principal
  interceptors/
    auth.interceptor.ts           # Injeta Bearer token
    error.interceptor.ts          # Trata erros HTTP centralizadamente
src/api/
  endpoints.ts                   # Constantes de endpoints
```

## Arquivos a criar

### `src/http/axios.ts`
```typescript
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { setupAuthInterceptor } from './interceptors/auth.interceptor'
import { setupErrorInterceptor } from './interceptors/error.interceptor'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

setupAuthInterceptor(http)
setupErrorInterceptor(http)

export default http
```

### `src/http/interceptors/auth.interceptor.ts`
```typescript
import type { AxiosInstance } from 'axios'

export function setupAuthInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    // Substitua pela forma correta de obter o token no seu projeto
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}
```

### `src/http/interceptors/error.interceptor.ts`
```typescript
import type { AxiosInstance, AxiosError } from 'axios'
import axios from 'axios'

export function setupErrorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (axios.isCancel(error)) return Promise.reject(error)

      const status = error.response?.status

      if (status === 401) {
        // Redirecionar para login — ajuste conforme o router do projeto
        window.location.href = '/login'
      }

      if (status === 403) {
        console.error('[HTTP 403] Sem permissão para esta ação')
      }

      if (status !== undefined && status >= 500) {
        console.error('[HTTP 5xx] Erro no servidor:', error.response?.data)
      }

      return Promise.reject(error)
    }
  )
}
```

### `src/api/endpoints.ts`
```typescript
export const ENDPOINTS = {
  // Adicione os endpoints do projeto aqui
  // patients: {
  //   list: '/patients',
  //   byId: (id: string) => `/patients/${id}`,
  // },
} as const
```

### `.env.example` (se não existir)
```
VITE_API_URL=http://localhost:3000/api
```

## Pós-instalação

Verifique se `axios` está instalado:
```!
cd /home/gilvan/tinellus/hospital_scale && cat package.json | grep axios || echo "⚠️  Axios não instalado — rode: npm install axios"
```
