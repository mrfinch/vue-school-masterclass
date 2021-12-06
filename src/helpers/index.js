export const findById = (resources, id) => resources?.find(r => r.id === id)

export const upsert = (resources, resource) => {
  const index = resources.findIndex(p => p.id === resource.id)
  if (index !== -1) {
    resources[index] = resource
  } else {
    resources.push(resource)
  }
}

export const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') {
    return doc
  }
  return { ...doc.data(), id: doc.id }
}
