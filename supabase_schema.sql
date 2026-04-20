-- ============================================
-- Esports Manager - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Players table
create table public.players (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  username    text not null,
  game        text default 'CS2',
  role        text default 'Rifler',
  kills       integer default 0,
  deaths      integer default 0,
  assists     integer default 0,
  wins        integer default 0,
  losses      integer default 0,
  bio         text,
  created_at  timestamptz default now()
);

-- Tournaments table
create table public.tournaments (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  game        text default 'CS2',
  format      text default 'Online',
  status      text default 'Ongoing',
  created_at  timestamptz default now()
);

-- Matches table
create table public.matches (
  id              uuid default gen_random_uuid() primary key,
  tournament_id   uuid references public.tournaments(id) on delete cascade not null,
  opponent        text not null,
  result          text check (result in ('win', 'loss', 'draw')) not null,
  score           text,
  notes           text,
  created_at      timestamptz default now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

alter table public.players     enable row level security;
alter table public.tournaments enable row level security;
alter table public.matches     enable row level security;

-- Players policies
create policy "Users can view own players"
  on public.players for select using (auth.uid() = user_id);

create policy "Users can insert own players"
  on public.players for insert with check (auth.uid() = user_id);

create policy "Users can update own players"
  on public.players for update using (auth.uid() = user_id);

create policy "Users can delete own players"
  on public.players for delete using (auth.uid() = user_id);

-- Tournaments policies
create policy "Users can view own tournaments"
  on public.tournaments for select using (auth.uid() = user_id);

create policy "Users can insert own tournaments"
  on public.tournaments for insert with check (auth.uid() = user_id);

create policy "Users can update own tournaments"
  on public.tournaments for update using (auth.uid() = user_id);

create policy "Users can delete own tournaments"
  on public.tournaments for delete using (auth.uid() = user_id);

-- Matches policies (via tournament ownership)
create policy "Users can view matches of own tournaments"
  on public.matches for select
  using (exists (
    select 1 from public.tournaments
    where tournaments.id = matches.tournament_id
    and tournaments.user_id = auth.uid()
  ));

create policy "Users can insert matches into own tournaments"
  on public.matches for insert
  with check (exists (
    select 1 from public.tournaments
    where tournaments.id = matches.tournament_id
    and tournaments.user_id = auth.uid()
  ));

create policy "Users can delete matches from own tournaments"
  on public.matches for delete
  using (exists (
    select 1 from public.tournaments
    where tournaments.id = matches.tournament_id
    and tournaments.user_id = auth.uid()
  ));
