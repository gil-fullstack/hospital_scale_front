#!/bin/bash
# Registra arquivos criados/editados com timestamp para rastreabilidade

input=$(cat)
file_path=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)
tool=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null)

if [ -z "$file_path" ]; then
  exit 0
fi

log_dir="/home/gilvan/tinellus/hospital_scale/.claude"
log_file="$log_dir/changes.log"

timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "$timestamp | $tool | $file_path" >> "$log_file"

exit 0
