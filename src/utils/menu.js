import { getRequest } from './api'

export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return
  }
  getRequest('/menu/').then(data => {
    console.log(data)
    // debugger
    if (data) {
      const fmtRoutes = formatRoutes(data.obj)
      console.log(fmtRoutes)
      router.selfAddRoutes(fmtRoutes)
      // router.addRoutes(fmtRoutes)
      store.commit('INIT_ROUTES', fmtRoutes)
      // store.dispatch('connect')
    }
  })
}
export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      // iconCls,
      children
    } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    const fmRouter = {
      path: path,
      name: name,
      // iconCls: iconCls,
      meta: meta,
      children: children,
      component (resolve) {
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sys')) {
          require(['../views/sys/' + component + '.vue'], resolve)
        } else if (component.startsWith('User')) {
          require(['../views/user/' + component + '.vue'], resolve)
        } else if (component.startsWith('Duty')) {
          require(['../views/duty/' + component + '.vue'], resolve)
        }
      }
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
