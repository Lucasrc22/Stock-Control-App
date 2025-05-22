

import { Outlet } from '@tanstack/react-router'

export default function Root() {
  return (
    <div>
      <h1>Stock Control App</h1>
      <Outlet />
    </div>
  )
}
