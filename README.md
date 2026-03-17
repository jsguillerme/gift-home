# Gift Home

Aplicacao Next.js para lista de presentes com:

- login com Google via Supabase
- sessao persistida no cliente
- diferenciacao entre admin e usuario comum por email
- leitura e atualizacao de presentes no Supabase

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie seu arquivo `.env.local` com base em `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=MEU_EMAIL_AQUI,OUTRO_EMAIL_AQUI
```

3. No painel do Supabase:

- habilite o provider Google em `Authentication > Providers`
- configure `Site URL` para `http://localhost:3000`
- configure `Redirect URL` para `http://localhost:3000/auth/callback`

4. Rode o SQL inicial em `supabase/sql/001_initial_schema.sql`.

5. Inicie a aplicacao:

```bash
npm run dev
```

## Fluxo

- usuarios autenticados conseguem ler a lista de presentes
- emails listados em `NEXT_PUBLIC_ADMIN_EMAILS` entram no painel admin
- qualquer outro email autenticado entra na interface comum
- no login, o app faz upsert do usuario na tabela `users`

## Estrutura principal

- `src/lib/supabase/client.ts`: cliente Supabase no browser
- `src/config/auth.ts`: helper `isAdminUser(email)`
- `src/services/auth.ts`: login, logout, sessao e upsert do usuario
- `src/services/gifts.ts`: leitura e mutacoes de presentes
- `src/hooks/use-auth.ts`: estado de autenticacao
- `src/hooks/use-gifts.ts`: estado e feedback da lista de presentes
- `src/components/gifts`: dashboards e componentes de presente
