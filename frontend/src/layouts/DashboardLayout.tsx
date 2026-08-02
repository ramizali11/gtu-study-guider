import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1500px] gap-6 p-4 sm:p-6 ">
        <div className="sticky top-6 hidden h-[calc(100vh-3rem)] shrink-0 lg:block ">
          <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <div className="h-full w-fit p-4" onClick={(event) => event.stopPropagation()}>
                <Sidebar
                  activeItem={activeItem}
                  onNavigate={(id) => {
                    setActiveItem(id);
                    setMobileOpen(false);
                  }}
                  onClose={() => setMobileOpen(false)}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Navbar onOpenSidebar={() => setMobileOpen(true)} />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
