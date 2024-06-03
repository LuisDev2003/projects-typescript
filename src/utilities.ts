export function $(selector: string): HTMLElement {
	return document.querySelector(selector) as HTMLElement
}
