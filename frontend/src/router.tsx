import { RootRoute, Route, Router } from '@tanstack/react-router'
import Root from './routes/__root'
import Home from './routes/home'

export const rootRoute = new RootRoute({
  component: Root,
})

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

export const router = new Router({
  routeTree: rootRoute.addChildren([homeRoute]),
})
