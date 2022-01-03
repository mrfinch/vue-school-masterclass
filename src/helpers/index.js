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

export function appendChildToParentMutation ({ parent, child }) {
  return (state, { parentId, childId }) => {
    const resource = findById(state.items, parentId)
    if (!resource) {
      console.warn(`parent resource: ${parent} does not exist`)
      return
    }
    resource[child] ||= []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}

export const makeFetchItemAction = ({ resource }) => {
  return ({ dispatch }, payload) => dispatch('fetchItem', { resource, ...payload }, { root: true })
}

export const makeFetchItemsAction = ({ resource }) => {
  return ({ dispatch }, payload) => dispatch('fetchItems', { resource, ...payload }, { root: true })
}
