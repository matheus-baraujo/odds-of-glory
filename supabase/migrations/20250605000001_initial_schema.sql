-- Odds of Glory — initial schema, RLS, triggers, Realtime

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (mirrors auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Admin-managed game content
-- ---------------------------------------------------------------------------
create table public.game_options (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'ancestry', 'background', 'career', 'skill', 'combat_skill',
    'language', 'condition', 'tag', 'tier_stat', 'approach'
  )),
  slug text not null,
  label text not null,
  data jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category, slug)
);

create table public.equipment_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier int not null check (tier between 1 and 3),
  tags text[] not null default '{}',
  defense int not null default 0,
  wear_max int not null default 2,
  abilities jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.aspect_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aspect_type text not null check (aspect_type in ('oath', 'pact', 'miracle', 'curse')),
  drive text,
  spells jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.rule_blocks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  category text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Characters
-- ---------------------------------------------------------------------------
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  tier int not null default 1 check (tier between 1 and 3),
  bio jsonb not null default '{}'::jsonb,
  sheet_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index characters_owner_id_idx on public.characters (owner_id);

create trigger characters_updated_at
  before update on public.characters
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Game rooms
-- ---------------------------------------------------------------------------
create table public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code char(6) not null unique,
  name text not null,
  master_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'lobby' check (status in ('lobby', 'active', 'closed')),
  session_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index game_rooms_master_id_idx on public.game_rooms (master_id);
create index game_rooms_code_idx on public.game_rooms (code);

create table public.room_participants (
  room_id uuid not null references public.game_rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  session_role text not null check (session_role in ('master', 'player')),
  character_id uuid references public.characters (id) on delete set null,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create index room_participants_user_id_idx on public.room_participants (user_id);

-- ---------------------------------------------------------------------------
-- Chat
-- ---------------------------------------------------------------------------
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.game_rooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'text' check (type in ('text', 'roll', 'system')),
  content text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index chat_messages_room_id_created_at_idx
  on public.chat_messages (room_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Character snapshots
-- ---------------------------------------------------------------------------
create table public.character_snapshots (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  room_id uuid references public.game_rooms (id) on delete set null,
  snapshot jsonb not null default '{}'::jsonb,
  label text,
  created_at timestamptz not null default now()
);

create index character_snapshots_character_id_idx on public.character_snapshots (character_id);

-- ---------------------------------------------------------------------------
-- Helper functions for RLS
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.room_participants
    where room_id = p_room_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_room_master(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.game_rooms
    where id = p_room_id and master_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.game_options enable row level security;
alter table public.equipment_templates enable row level security;
alter table public.aspect_templates enable row level security;
alter table public.rule_blocks enable row level security;
alter table public.characters enable row level security;
alter table public.game_rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.character_snapshots enable row level security;

-- Profiles
create policy "profiles_select_own_or_room_master"
  on public.profiles for select
  using (
    auth.uid() = id
    or public.is_admin()
    or exists (
      select 1
      from public.room_participants rp_self
      join public.room_participants rp_other on rp_other.room_id = rp_self.room_id
      join public.game_rooms gr on gr.id = rp_self.room_id
      where rp_self.user_id = auth.uid()
        and rp_other.user_id = profiles.id
        and gr.master_id = auth.uid()
    )
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Published content readable by authenticated users
create policy "game_options_select_published"
  on public.game_options for select
  using (published = true or public.is_admin());

create policy "game_options_admin_all"
  on public.game_options for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "equipment_templates_select_published"
  on public.equipment_templates for select
  using (published = true or public.is_admin());

create policy "equipment_templates_admin_all"
  on public.equipment_templates for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "aspect_templates_select_published"
  on public.aspect_templates for select
  using (published = true or public.is_admin());

create policy "aspect_templates_admin_all"
  on public.aspect_templates for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "rule_blocks_select_published"
  on public.rule_blocks for select
  using (published = true or public.is_admin());

create policy "rule_blocks_admin_all"
  on public.rule_blocks for all
  using (public.is_admin())
  with check (public.is_admin());

-- Characters
create policy "characters_owner_all"
  on public.characters for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "characters_master_read_room"
  on public.characters for select
  using (
    exists (
      select 1
      from public.room_participants rp
      join public.game_rooms gr on gr.id = rp.room_id
      where gr.master_id = auth.uid()
        and rp.character_id = characters.id
    )
  );

-- Game rooms
create policy "game_rooms_select_member_or_master"
  on public.game_rooms for select
  using (
    master_id = auth.uid()
    or public.is_room_member(id)
  );

create policy "game_rooms_insert_master"
  on public.game_rooms for insert
  with check (master_id = auth.uid());

create policy "game_rooms_update_master"
  on public.game_rooms for update
  using (master_id = auth.uid())
  with check (master_id = auth.uid());

-- Room participants
create policy "room_participants_select_member"
  on public.room_participants for select
  using (public.is_room_member(room_id) or public.is_room_master(room_id));

create policy "room_participants_insert_self_or_master"
  on public.room_participants for insert
  with check (
    user_id = auth.uid()
    or public.is_room_master(room_id)
  );

create policy "room_participants_update_self_or_master"
  on public.room_participants for update
  using (user_id = auth.uid() or public.is_room_master(room_id))
  with check (user_id = auth.uid() or public.is_room_master(room_id));

-- Chat messages
create policy "chat_messages_select_member"
  on public.chat_messages for select
  using (public.is_room_member(room_id));

create policy "chat_messages_insert_member"
  on public.chat_messages for insert
  with check (
    public.is_room_member(room_id)
    and user_id = auth.uid()
  );

-- Character snapshots
create policy "character_snapshots_owner_all"
  on public.character_snapshots for all
  using (
    exists (
      select 1 from public.characters c
      where c.id = character_snapshots.character_id
        and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.characters c
      where c.id = character_snapshots.character_id
        and c.owner_id = auth.uid()
    )
  );

create policy "character_snapshots_master_read"
  on public.character_snapshots for select
  using (
    room_id is not null
    and public.is_room_master(room_id)
  );

-- ---------------------------------------------------------------------------
-- Realtime (enable in Supabase Dashboard if publication already exists)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
exception
  when undefined_object then
    null;
end $$;
