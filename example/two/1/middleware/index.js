import { resolve } from 'path'
import { Route } from '../decorator/router'

const init = (app) => {
  const routesPath = resolve(__dirname, '../router')
  const Router = new Route(app, routesPath)
  Router.init()
}

export default init