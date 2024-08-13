import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
    return (
        <div>
            <Link to="/">Home</Link>
            <TanStackRouterDevtools />
            <Outlet />
        </div>
    )
};

export const Route = createRootRoute({
    component: RootComponent,
});
