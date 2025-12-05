create extension if not exists "pgcrypto";
create table polls (
  id uuid default gen_random_uuid() primary key,
  creator_address text not null,
  title text not null,
  description text,
  options jsonb not null,
  created_at timestamptz default now(),
  expires_at timestamptz,
  is_published boolean default true
);
create table votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references polls(id) on delete cascade,
  voter_address text not null,
  option_index int not null,
  created_at timestamptz default now(),
  constraint unique_vote_per_poll unique (poll_id, voter_address)
);
create index on votes (poll_id);
