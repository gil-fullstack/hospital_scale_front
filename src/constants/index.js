export const CATEGORIAS = {
  MEDICO: 'Médico',
  ENFERMEIRO: 'Enfermeiro',
  TECNICO: 'Técnico',
}

export const TURNOS = {
  MANHA: { label: 'Manhã', horario: '07–13h', horas: 6 },
  TARDE: { label: 'Tarde', horario: '13–19h', horas: 6 },
  NOITE: { label: 'Noite', horario: '19–07h', horas: 12 },
}

export const TURNO_KEYS = Object.keys(TURNOS)
