---
name: axios-endpoint
description: Integra um novo endpoint da API REST ao projeto — cria o tipo de request/response, adiciona o endpoint às constantes, implementa o método no serviço de domínio e cria o composable para uso no componente.
user-invocable: true
argument-hint: "[domínio] [método HTTP] [/endpoint] — ex: patient GET /patients/:id"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - LS
---

# Axios Endpoint Integration

Integre o endpoint: **$ARGUMENTS**

Parsing dos argumentos:
- Domínio: `$0` (ex: patient, appointment, doctor)
- Método HTTP: `$1` (GET, POST, PUT, DELETE, PATCH)
- Endpoint: `$2` (ex: /patients, /patients/:id)

## Passo 1 — Verificar estrutura existente

```!
ls /home/gilvan/tinellus/hospital_scale/src/http 2>/dev/null
ls /home/gilvan/tinellus/hospital_scale/src/services 2>/dev/null
ls /home/gilvan/tinellus/hospital_scale/src/types 2>/dev/null
cat /home/gilvan/tinellus/hospital_scale/src/api/endpoints.ts 2>/dev/null
```

Se `src/http/axios.ts` não existir, instrua o usuário a rodar `/axios-setup` primeiro.

## Passo 2 — Criar/atualizar tipos

Em `src/types/$0.types.ts` (criar se não existir, adicionar se existir):

```typescript
// Tipo da resposta do endpoint
export interface [NomeDaEntidade] {
  id: string
  // ... campos retornados pela API
}

// DTO de criação (para POST/PUT)
export interface Create[NomeDaEntidade]DTO {
  // ... campos enviados
}
```

## Passo 3 — Adicionar endpoint às constantes

Em `src/api/endpoints.ts`, adicione ao objeto `ENDPOINTS`:

```typescript
$0: {
  // ... endpoints existentes +
  [novoEndpoint]: '$2',
},
```

## Passo 4 — Implementar no serviço

Em `src/services/$0.service.ts` (criar se não existir, adicionar método se existir):

```typescript
import http from '@/http/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { [NomeDaEntidade] } from '@/types/$0.types'

export const $0Service = {
  // ... métodos existentes +

  async [nomeDoMetodo](/* params */): Promise<[TipoDeRetorno]> {
    const { data } = await http.$1<[TipoDeRetorno]>(
      ENDPOINTS.$0.[endpoint],
      /* body para POST/PUT */
    )
    return data
  },
}
```

## Passo 5 — Criar composable (opcional, se o endpoint for usado em componentes)

Em `src/composables/use[NomeDaEntidade].ts`:

```typescript
import { ref } from 'vue'
import { $0Service } from '@/services/$0.service'
import type { [NomeDaEntidade] } from '@/types/$0.types'

export function use[NomeDaEntidade]() {
  const data = ref<[NomeDaEntidade] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(/* params */) {
    loading.value = true
    error.value = null
    try {
      data.value = await $0Service.[nomeDoMetodo](/* params */)
    } catch {
      error.value = 'Erro ao carregar dados. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch }
}
```

## Checklist final

- [ ] Tipos criados/atualizados em `src/types/$0.types.ts`
- [ ] Endpoint adicionado em `src/api/endpoints.ts`
- [ ] Método implementado em `src/services/$0.service.ts`
- [ ] Composable criado em `src/composables/use[Nome].ts` (se necessário)
- [ ] Serviço retorna dado tipado, não `AxiosResponse`
- [ ] Nenhuma URL string literal no código
