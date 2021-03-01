export const template = (html) => {
  const template = document.createElement('template')

  template.innerHTML = html

  return [[...template.content.children]]
}
