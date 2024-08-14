import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const RootComponent = () => {
    return (
        <div className="bg-background">
            <div className="flex">
                <SideBar />
                <div>
                    <Header />
                    <Outlet />
                </div>
            </div>

            <TanStackRouterDevtools position="bottom-right" />

        </div>
    )
};

export const Route = createRootRoute({
    component: RootComponent,
});
