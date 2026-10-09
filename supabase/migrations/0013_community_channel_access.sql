drop policy if exists "channels readable" on public.community_channels;
drop policy if exists "read community channels" on public.community_channels;

create policy "channels readable"
  on public.community_channels
  for select
  to public
  using (true);

insert into public.community_channels (slug, name, description, sort_order)
values
  ('general', 'General', 'Say hi and talk about anything founder-related', 1),
  ('feedback', 'Feedback', 'Share your idea or landing page and get honest feedback', 2),
  ('cofounders', 'Find a Cofounder', 'Looking for a teammate? Say what you need', 3)
on conflict (slug) do nothing;
