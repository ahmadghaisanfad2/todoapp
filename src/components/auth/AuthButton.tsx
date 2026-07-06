import { LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signIn, signOut, useSession } from '@/lib/auth-client'
import { SyncStatus } from '@/components/sync/SyncStatus'

export function AuthButton() {
  const { data: session, isPending } = useSession()

  const handleSignIn = () => {
    void signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/app`,
    })
  }

  const handleSignOut = () => {
    void signOut()
  }

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" disabled className="px-2.5">
        …
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignIn}
        className="gap-1.5 px-2.5"
        aria-label="Sign in with Google"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden text-xs sm:inline">Sign in</span>
      </Button>
    )
  }

  const name = session.user.name ?? session.user.email ?? 'Account'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-1">
      <SyncStatus />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0 font-medium"
            aria-label="Account menu"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                {initial}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            {name}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
