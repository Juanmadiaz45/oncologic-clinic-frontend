// Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Registro creado exitosamente',
    UPDATE: 'Registro actualizado exitosamente',
    DELETE: 'Registro eliminado exitosamente',
    LOGIN: 'Bienvenido al sistema'
  },
  ERROR: {
    CREATE: 'Error al crear el registro',
    UPDATE: 'Error al actualizar el registro',
    DELETE: 'Error al eliminar el registro',
    LOGIN: 'Credenciales inválidas',
    NETWORK: 'Error de conexión',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION: 'Datos inválidos'
  },
  CONFIRMATION: {
    DELETE: '¿Estás seguro de que deseas eliminar este registro?',
    LOGOUT: '¿Estás seguro de que deseas cerrar sesión?'
  }
} as const;