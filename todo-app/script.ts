import { $ } from '../src/utilities'
import { Tarea } from './types'

let getDataStorage: string | null = localStorage.getItem('dataTodo')
let setDataStorage: string | null = null

let listTodoStorage: Tarea[] = getDataStorage ? JSON.parse(getDataStorage) : []

const $formTodo = $('#form-todo') as HTMLFormElement
const $inputTitle = $('#input-titulo') as HTMLInputElement
const $listTodo = $('#list-todo') as HTMLUListElement
const $buttonClear = $('#button-clear') as HTMLButtonElement

const svgUpdate = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
		class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
		<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
		<path d="M16 5l3 3" />
	</svg>
`
const svgDelete = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
		stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
		class="icon icon-tabler icons-tabler-outline icon-tabler-x">
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M18 6l-12 12" />
		<path d="M6 6l12 12" />
	</svg>
`

function updateDataStorage(): void {
	localStorage.setItem('dataTodo', JSON.stringify(listTodoStorage))
}

function renderListTodo(data: Array<Tarea>): void {
	$listTodo.innerHTML = ''
	if (!data || data.length === 0) return

	data.forEach(({ id, titulo, completado }) => {
		const completed = completado ? 'bg-green-600' : 'bg-red-600'

		const itemTodo = document.createElement('li')
		itemTodo.id = `item-todo-${id}`
		itemTodo.className = `flex items-center gap-x-1.5`
		itemTodo.innerHTML = `
			<label for="input-todo-${id}"
				class="flex gap-x-1.5 items-center justify-between py-2 px-3 rounded-lg w-full hover:cursor-pointer ${completed}">
				<span>${titulo}</span>
				<input type="checkbox" id="input-todo-${id}"
					class="size-5 text-blue-600 bg-gray-100 border-gray-300 rounded hover:cursor-pointer hidden">
			</label>

			<button type="button" class="update bg-yellow-300 text-black rounded-md p-2 hover:bg-yellow-500">
				${svgUpdate}
			</button>

			<button type="button" class="delete bg-red-500 rounded-md p-2 hover:bg-red-700">
				${svgDelete}
			</button>
		`
		$listTodo.appendChild(itemTodo)
	})
}

function clearListTodo(): void {
	if (confirm('¿Quieres borrar toda la lista de tareas?')) {
		localStorage.clear()
		$listTodo.innerHTML = ''
	}
}

function createItemTodo(event: SubmitEvent): void {
	event.preventDefault()

	getDataStorage = localStorage.getItem('dataTodo')
	const title = $inputTitle.value.trim()
	if (!title) return

	const newTodo: Tarea = {
		id: Date.now(),
		titulo: title,
		completado: false,
	}

	const currentTodos: Tarea[] = getDataStorage ? JSON.parse(getDataStorage) : []

	currentTodos.push(newTodo)
	setDataStorage = JSON.stringify(currentTodos)
	localStorage.setItem('dataTodo', setDataStorage)
	renderListTodo(currentTodos)
	$inputTitle.value = ''

	// Actualiza los datos insertados en el localStorage
	getDataStorage = localStorage.getItem('dataTodo')
	listTodoStorage = getDataStorage ? JSON.parse(getDataStorage) : []
}

function updateItemTodo(id: number, nuevoTitulo: string): void {
	const tarea = listTodoStorage.find(tarea => tarea.id === id)

	if (tarea) tarea.titulo = nuevoTitulo

	updateDataStorage()
	renderListTodo(listTodoStorage)
}

function deleteItemTodo(id: number): void {
	const index = listTodoStorage.findIndex(tarea => tarea.id === id)

	if (index !== -1) {
		listTodoStorage.splice(index, 1)
		updateDataStorage()
		renderListTodo(listTodoStorage)
	}
}

$formTodo.addEventListener('submit', createItemTodo)
$buttonClear.addEventListener('click', clearListTodo)

function toggleItemTodo(id: number): void {
	const tarea = listTodoStorage.find(tarea => tarea.id === id)
	if (tarea) tarea.completado = !tarea.completado

	updateDataStorage()
	renderListTodo(listTodoStorage)
}

$listTodo.addEventListener('click', (event: MouseEvent) => {
	const target = event.target as HTMLElement
	const checkbox = target.closest('input[type="checkbox"]')
	const isButton = target.closest('button') ?? target
	const isUpdate = isButton.classList.contains('update')
	const isDelete = isButton.classList.contains('delete')

	if (isUpdate) {
		const listItem = target.closest('li')
		const id = parseInt(listItem?.id.replace('item-todo-', '') || '')

		const titulo: string = listItem?.querySelector('span')?.textContent ?? ''
		const nuevoTitulo = prompt('Ingrese el nuevo título:', titulo)

		if (nuevoTitulo) updateItemTodo(id, nuevoTitulo)
	} else if (isDelete) {
		const listItem = target.closest('li')
		const id = parseInt(listItem?.id.replace('item-todo-', '') || '')
		deleteItemTodo(id)
	} else if (checkbox) {
		const listItem = target.closest('li')
		const id = parseInt(listItem?.id.replace('item-todo-', '') || '')
		toggleItemTodo(id)
	}
})

renderListTodo(listTodoStorage)
