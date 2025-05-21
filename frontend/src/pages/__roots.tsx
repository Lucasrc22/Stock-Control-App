
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <h1>Minha Aplicação</h1>
      <Outlet />
    </>
  ),
});
