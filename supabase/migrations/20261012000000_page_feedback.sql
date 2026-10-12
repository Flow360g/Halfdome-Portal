-- "Was this page helpful?" responses from the people hub.
-- Anyone using the hub can add a response; nobody can read them through the
-- public API. People and Culture reads them in the Supabase dashboard.
create table if not exists public.page_feedback (
  id bigint generated always as identity primary key,
  page text not null check (char_length(page) <= 200),
  helpful boolean not null,
  comment text check (comment is null or char_length(comment) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.page_feedback enable row level security;

create policy "People can leave feedback"
  on public.page_feedback
  for insert
  to anon, authenticated
  with check (true);

-- No select, update or delete policies: responses are write-only from the hub.
revoke all on public.page_feedback from anon, authenticated;
grant insert on public.page_feedback to anon, authenticated;
