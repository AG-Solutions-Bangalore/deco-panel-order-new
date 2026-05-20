import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthGuard } from '@/components/providers/auth-guard'
import { BottomNav } from '@/components/layouts/bottom-nav'
import { DesktopSidebar } from '@/components/layouts/desktop-sidebar'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { InstallAppPrompt } from '@/components/pwa/install-app-prompt'

export function RootLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthGuard>
          <div className="flex h-dvh overflow-hidden">
            <DesktopSidebar />
            <main className="flex-1 flex flex-col overflow-y-auto relative bg-bg">
              <Outlet />
              <InstallAppPrompt />
              <BottomNav />
            </main>
          </div>
        </AuthGuard>
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </ThemeProvider>
  )
}
