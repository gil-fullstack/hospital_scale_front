---
name: test-generate
description: Gera testes unitários ou de componente para um arquivo Vue, composable ou utilitário. Usa Vitest e Vue Test Utils. Cria fixtures quando necessário e segue a estrutura de testes do projeto.
user-invocable: true
argument-hint: "[caminho/do/arquivo.vue ou composable.ts]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - LS
---

# Test Generate

Gere testes para: **$ARGUMENTS**

## Processo

### 1. Análise do arquivo
- Leia o arquivo especificado
- Identifique: tipo (componente Vue, composable, utilitário puro, serviço)
- Liste todos os comportamentos a testar:
  - Para componentes: renderização, interações, emits, estados (loading/error/empty)
  - Para composables: retorno inicial, comportamento por ação, estados async
  - Para utilitários: casos normais, edge cases, casos de erro

### 2. Determine o arquivo de output
- Componente `src/components/X.vue` → `tests/component/X.spec.ts`
- Composable `src/composables/useX.ts` → `tests/unit/composables/useX.spec.ts`
- Utilitário `src/utils/x.ts` → `tests/unit/utils/x.spec.ts`

### 3. Escreva os testes

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
// Para componentes: import { mount } from '@vue/test-utils'

describe('[NomeDoArquivo]', () => {
  // Setup comum (se necessário)
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[grupo de cenários]', () => {
    it('deve [comportamento esperado] quando [condição]', () => {
      // Arrange
      const input = /* ... */

      // Act
      const result = /* ... */

      // Assert
      expect(result).toBe(/* ... */)
    })
  })
})
```

## Padrões por tipo

### Composable assíncrono
```typescript
it('deve setar loading true durante a busca', async () => {
  // Arrange
  const { loading, fetch } = usePatients()
  vi.mocked(patientService.getAll).mockImplementation(() =>
    new Promise(resolve => setTimeout(resolve, 100))
  )

  // Act
  const promise = fetch()

  // Assert — durante
  expect(loading.value).toBe(true)

  await promise
  expect(loading.value).toBe(false)
})
```

### Componente Vue
```typescript
it('deve emitir save com os dados do formulário ao submeter', async () => {
  // Arrange
  const wrapper = mount(PatientForm, {
    props: { patientId: null }
  })

  // Act
  await wrapper.find('[data-testid="name-input"]').setValue('João Silva')
  await wrapper.find('form').trigger('submit')

  // Assert
  expect(wrapper.emitted('save')).toHaveLength(1)
  expect(wrapper.emitted('save')![0][0]).toMatchObject({ name: 'João Silva' })
})
```

## Fixtures

Se o teste precisa de dados complexos, crie em `tests/fixtures/`:
```typescript
// tests/fixtures/patient.fixture.ts
export const mockPatient = (overrides = {}) => ({
  id: 'patient-1',
  name: 'João Silva',
  cpf: '123.456.789-00',
  ...overrides,
})
```
