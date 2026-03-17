"use client"

import { LoginScreen } from "@/src/components/auth/login-screen"
import { AdminDashboard } from "@/src/components/gifts/admin-dashboard"
import { UserDashboard } from "@/src/components/gifts/user-dashboard"
import { useAuth } from "@/src/hooks/use-auth"
import { useGifts } from "@/src/hooks/use-gifts"

export default function HomePage() {
  const auth = useAuth()
  const gifts = useGifts(auth.isAuthenticated)

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
        <div className="rounded-xl bg-white px-6 py-5 text-sm text-stone-600 shadow-sm">
          Carregando sessao...
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated || !auth.profile) {
    return (
      <LoginScreen
        error={auth.error}
        isLoading={auth.isSigningIn}
        onLogin={auth.loginWithGoogle}
      />
    )
  }

  const profile = auth.profile

  if (auth.isAdmin) {
    return (
      <AdminDashboard
        user={profile}
        gifts={gifts.gifts}
        feedback={gifts.feedback}
        isLoading={gifts.isLoading}
        isSubmitting={gifts.isSubmitting || auth.isSigningOut}
        onCreateGift={gifts.createGift}
        onUpdateGift={gifts.updateGift}
        onDeleteGift={gifts.deleteGift}
        onClearReservation={gifts.clearGiftReservation}
        onLogout={auth.logout}
      />
    )
  }

  return (
    <UserDashboard
      user={profile}
      gifts={gifts.gifts}
      feedback={gifts.feedback}
      isLoading={gifts.isLoading}
      isSubmitting={gifts.isSubmitting || auth.isSigningOut}
      onReserveGift={(giftId) => gifts.reserveGift(giftId, profile.id)}
      onUnreserveGift={(giftId) => gifts.unreserveGift(giftId, profile.id)}
      onLogout={auth.logout}
    />
  )
}
