export function hasClass (el, className) {
  return el.classList.contains(className)
}
export function addClass (el, className) {
  el.classList.add(className)
}
export function removeClass (el, className) {
  el.classList.remove(className)
}
export function nodeToString (node) {
  let div = document.createElement('div')
  div.appendChild(node)
  return div.innerHTML
}
