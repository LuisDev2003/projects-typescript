export interface Tarea {
	id: number
	titulo: string
	completado: boolean
}

export interface Tarea2 {
	id: number
	titulo: string
	descripcion: string
	fechaCreacion: string
	fechaVencimiento: string
	prioridad: string
	completado: boolean
	categoria: string
	etiquetas: string[]
	subtareas: Subtarea[]
}

export interface Subtarea {
	id: number
	titulo: string
	completado: boolean
}
