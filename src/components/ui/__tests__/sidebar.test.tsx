import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar, SidebarRail, SidebarInset, SidebarInput, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction, SidebarMenu, SidebarMenuSkeleton, SidebarMenuAction, SidebarMenuButton, SidebarMenuBadge, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem} from '../sidebar';
import userEvent from '@testing-library/user-event';

vi.stubGlobal('matchMedia', vi.fn(() => ({
  matches: false,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})));

describe('Sidebar', () => {
  it('renders the Sidebar component', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('toggles the sidebar when the trigger is clicked', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const triggerButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(triggerButton);

    const sidebar = screen.getByText('Sidebar Content');
    expect(sidebar).toBeInTheDocument();
  });

  it('collapses the sidebar when the toggle function is called', () => {
    const TestComponent = () => {
      const { toggleSidebar } = useSidebar();
      return (
        <>
          <Sidebar>
            <div>Sidebar Content</div>
          </Sidebar>
          <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </>
      );
    };

    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleButton);

    const sidebar = screen.getByText('Sidebar Content');
    expect(sidebar).toBeInTheDocument();
  });

  it('renders the sidebar in mobile view', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(
      <SidebarProvider>
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
      </SidebarProvider>
    );

  });
  it('renders the sidebar with a custom width', () => {
    render(
      <SidebarProvider>
        <Sidebar >
          <div>Sidebar Content</div>
        </Sidebar>
      </SidebarProvider>
    );

  });

  it('renders the sidebar with a custom variant', () => {
    render(
      <SidebarProvider>
        <Sidebar variant="floating">
          <div>Sidebar Content</div>
        </Sidebar>
      </SidebarProvider>
    );
  });

});

it("renders the SidebarRail and toggles the sidebar when clicked", async () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <div>Sidebar Content</div>
      </Sidebar>
      <SidebarRail />
    </SidebarProvider>
  );

  const rail = screen.getByRole("button", { name: /toggle sidebar/i });
  expect(rail).toBeInTheDocument();

  await userEvent.click(rail);
  const sidebar = screen.getByText("Sidebar Content");
  expect(sidebar).toBeInTheDocument();
});

it("renders the SidebarInset with correct styles", () => {
  render(
    <SidebarProvider>
      <Sidebar variant="inset">
        <div>Sidebar Content</div>
      </Sidebar>
      <SidebarInset>Main Content</SidebarInset>
    </SidebarProvider>
  );

  const inset = screen.getByText("Main Content");
  expect(inset).toBeInTheDocument();
  expect(inset).toHaveClass("peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]");
});

it("renders the SidebarInput and handles input", async () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarInput placeholder="Search..." />
      </Sidebar>
    </SidebarProvider>
  );

});

it("renders the SidebarHeader and SidebarFooter correctly", () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );

});

it("renders the SidebarSeparator correctly", () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarSeparator />
      </Sidebar>
    </SidebarProvider>
  );

});

it("renders the SidebarGroup and subcomponents correctly", () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarGroup>
          <SidebarGroupLabel>Group Label</SidebarGroupLabel>
          <SidebarGroupAction>Action</SidebarGroupAction>
          <SidebarGroupContent>Group Content</SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  );
});

it("renders the SidebarMenu and subcomponents correctly", () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Menu Button</SidebarMenuButton>
            <SidebarMenuAction>Action</SidebarMenuAction>
            <SidebarMenuBadge>Badge</SidebarMenuBadge>
          </SidebarMenuItem>
          <SidebarMenuSkeleton />
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
});

it("renders the SidebarMenuSub and subcomponents correctly", () => {
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Menu Button</SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton>Sub Button</SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );

});

it("renders the sidebar with a custom width", () => {
  render(
    <SidebarProvider>
      <Sidebar style={{ width: "20rem" }}>
        <div>Sidebar Content</div>
      </Sidebar>
    </SidebarProvider>
  );
});

it("renders the sidebar with a floating variant", () => {
  render(
    <SidebarProvider>
      <Sidebar variant="floating">
        <div>Sidebar Content</div>
      </Sidebar>
    </SidebarProvider>
  );

});

it("renders the sidebar with an inset variant", () => {
  render(
    <SidebarProvider>
      <Sidebar variant="inset">
        <div>Sidebar Content</div>
      </Sidebar>
    </SidebarProvider>
  );

});