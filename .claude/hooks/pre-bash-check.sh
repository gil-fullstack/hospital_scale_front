#!/bin/bash
# Bloqueia comandos Bash destrutivos ou perigosos antes de executar

input=$(cat)
command=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

if [ -z "$command" ]; then
  exit 0
fi

# Bloquear remoção recursiva forçada em caminhos sensíveis
if echo "$command" | grep -qE "rm\s+-rf?\s+/|rm\s+--force\s+-r\s+/"; then
  echo "BLOQUEADO: Remoção recursiva em caminhos raiz não permitida neste projeto." >&2
  exit 2
fi

# Bloquear truncar arquivos de configuração críticos
if echo "$command" | grep -qE ">\s*(\.env|package\.json|vite\.config|tsconfig)"; then
  echo "BLOQUEADO: Sobrescrever arquivo de configuração crítico não permitido diretamente." >&2
  exit 2
fi

# Bloquear drop de banco (caso haja scripts SQL)
if echo "$command" | grep -qiE "DROP\s+DATABASE|DROP\s+TABLE\s+--cascade"; then
  echo "BLOQUEADO: Operação destrutiva de banco de dados detectada." >&2
  exit 2
fi

exit 0
