# Odds of Glory

Mesa virtual para **Fir Aesvold** — fichas de personagem, salas de jogo, chat em tempo real e rolagens d6. Frontend estático (Next.js export) com **Supabase** como backend (Auth, Postgres, Realtime, RLS).

## Pré-requisitos

- Node.js 22+
- Conta [Supabase](https://supabase.com)
- (Opcional) Google Cloud Console — OAuth para login com Google

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon/public do Supabase |
| `NEXT_PUBLIC_BASE_PATH` | Base path do app (`/odds-of-glory` no GitHub Pages) |
| `NEXT_PUBLIC_ADMIN_PATH` | Segmento oculto da rota admin (ex: `admin-seu-segredo-aqui`) |

## Setup Supabase

### 1. Criar projeto

Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).

### 2. Aplicar migrations

Com a [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
cd odds-of-glory
supabase link --project-ref <seu-project-ref>
supabase db push
```

Ou cole o conteúdo de `supabase/migrations/*.sql` no **SQL Editor** do Dashboard, na ordem.

As migrations criam:

- `profiles`, `characters`, `game_rooms`, `room_participants`, `chat_messages`, `character_snapshots`
- Conteúdo administrável: `game_options`, `equipment_templates`, `aspect_templates`, `rule_blocks`
- Políticas **RLS** (owner, master, player, admin, room member)
- Trigger de perfil ao registrar usuário
- Seed inicial (Atitudes, perícias, idiomas, condições, tier stats) a partir de `references/Core Rules.md`

### 3. Realtime

No Dashboard: **Database → Replication** — confirme que `chat_messages` está na publicação `supabase_realtime` (a migration tenta adicionar automaticamente).

### 4. GraphQL (opcional, Fase 2+)

Habilite a extensão `pg_graphql` em **Database → Extensions** para queries GraphQL em `/graphql/v1`.

### 5. Tornar um usuário admin

Após o primeiro login:

```sql
update public.profiles set is_admin = true where id = '<uuid-do-usuario>';
```

## Google OAuth

1. **Google Cloud Console** → Credentials → OAuth 2.0 Client ID (Web).
2. **Authorized redirect URIs** (Supabase callback):
   - `https://<project-ref>.supabase.co/auth/v1/callback`
3. **Supabase Dashboard** → Authentication → Providers → Google: cole Client ID e Secret.
4. **Supabase** → Authentication → URL Configuration:
   - **Site URL:** `https://<user>.github.io/odds-of-glory/` (produção; use localhost apenas se for o único ambiente)
   - **Redirect URLs** (match exato — sem query params extras):
     - `http://localhost:3000/odds-of-glory/auth/callback/`
     - `https://<user>.github.io/odds-of-glory/auth/callback/`

O `redirectTo` do OAuth **não inclui** `?next=` — o destino pós-login é guardado em `sessionStorage` antes do redirect, para bater exatamente com a whitelist do Supabase. Se o redirect cair em localhost em produção, verifique a Site URL e se as Redirect URLs coincidem byte a byte com o callback (incluindo trailing slash).

### Confirmação de email (cadastro manual)

O cadastro envia `emailRedirectTo` apontando para `/auth/callback/` na origem atual (mesma URL do OAuth). Sem isso, o Supabase usa a **Site URL** do Dashboard no link do email — se ela estiver em `localhost`, usuários em produção serão redirecionados para localhost ao confirmar.

- **Redirect URLs** já listadas acima cobrem OAuth e confirmação de email.
- **Site URL:** prefira a URL de produção (`https://<user>.github.io/odds-of-glory/`) como fallback padrão; mantenha localhost só se for o único ambiente.

O app usa **PKCE** no cliente; tokens ficam no mecanismo client-side do Supabase (`localStorage`). Export estático no GitHub Pages não suporta cookies `httpOnly` sem backend dedicado.

## Desenvolvimento local

```bash
cd odds-of-glory
npm install
npm run dev
```

Abra [http://localhost:3000/odds-of-glory/](http://localhost:3000/odds-of-glory/) (basePath aplicado automaticamente).

## Build e export estático

```bash
npm run build
```

Saída em `out/`. Configuração em `next.config.ts`: `output: 'export'`, `basePath`, `trailingSlash`.

## Testes E2E (Playwright)

```bash
npm run test:e2e
npm run test:e2e:ui   # modo interativo
```

Cenários mínimos em `e2e/`:

- Login (formulário + credenciais inválidas com Supabase configurado)
- Rotas protegidas redirecionam sem sessão
- Lobby / admin / fichas exigem autenticação

## Deploy — GitHub Pages

Workflow: `.github/workflows/deploy.yml` (dispara no push em `main`).

1. **Settings → Pages → Source:** GitHub Actions.
2. **Settings → Secrets → Actions:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PATH` (opcional)

URL final: `https://<user>.github.io/odds-of-glory/`

## Arquitetura

```text
Next.js (static export, SPA)
  ├── Auth PKCE → Supabase Auth (email + Google)
  ├── Dados → Supabase Postgres + RLS
  └── Chat → Supabase Realtime (chat_messages)
```

Toda autorização sensível vive em **RLS** no Postgres — o frontend apenas reflete permissões; nunca confie só no cliente.

## Estrutura do projeto

```text
src/
├── app/
│   ├── (auth)/login, register
│   ├── auth/callback          # OAuth PKCE
│   ├── (app)/lobby, characters
│   └── (admin)/[adminPath]
├── components/ui/             # shadcn
├── features/auth/
├── lib/supabase/
└── types/
supabase/migrations/           # schema + seed
e2e/                           # Playwright
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build + export estático |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Testes Playwright |

## Licença

Projeto de portfólio / playtest — regras Fir Aesvold em evolução; conteúdo administrável via CMS admin (Fase 5).
