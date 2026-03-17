import { AuthCallbackClient } from "@/src/components/auth/auth-callback-client"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const params = await searchParams

  return <AuthCallbackClient authCode={params.code ?? null} />
}
