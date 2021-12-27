import debounce from 'lodash/debounce'

const PageScrollDirective = {
  mounted (el, binding) {
    el.__PageScroll__ = debounce(() => {
      return binding.value
    }, 100, { leading: true })
    document.addEventListener('scroll', el.__PageScroll__)
  },
  unmounted (el) {
    document.removeEventListener('scroll', el.__PageScroll__)
  }
}
export default (app) => {
  app.directive('page-scroll', PageScrollDirective)
}
