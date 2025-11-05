-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  website text,
  role text check (role in ('admin', 'user')) not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text,
  project_url text,
  github_url text,
  technologies text[] not null default '{}',
  featured boolean not null default false,
  project_date text not null default 'January 2024',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS on tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Create policies for profiles
do $$ 
begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.') then
    create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  end if;
  
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert their own profile.') then
    create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
  end if;
  
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile.') then
    create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Create policies for projects
do $$ 
begin
  if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Projects are viewable by everyone.') then
    create policy "Projects are viewable by everyone." on projects for select using (true);
  end if;
  
  if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Users can insert their own projects.') then
    create policy "Users can insert their own projects." on projects for insert with check (auth.uid() = user_id);
  end if;
  
  if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Users can update own projects.') then
    create policy "Users can update own projects." on projects for update using (auth.uid() = user_id);
  end if;
  
  if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Users can delete own projects.') then
    create policy "Users can delete own projects." on projects for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Create function to handle new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user (safe approach)
do $$
begin
  if not exists (
    select 1 from information_schema.triggers 
    where trigger_name = 'on_auth_user_created' 
    and event_object_table = 'users'
    and trigger_schema = 'auth'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;

-- Create function to update updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at (safe approach)
do $$
begin
  if not exists (
    select 1 from information_schema.triggers 
    where trigger_name = 'handle_updated_at' 
    and event_object_table = 'profiles'
    and trigger_schema = 'public'
  ) then
    create trigger handle_updated_at before update on public.profiles
      for each row execute procedure public.handle_updated_at();
  end if;
  
  if not exists (
    select 1 from information_schema.triggers 
    where trigger_name = 'handle_updated_at' 
    and event_object_table = 'projects'
    and trigger_schema = 'public'
  ) then
    create trigger handle_updated_at before update on public.projects
      for each row execute procedure public.handle_updated_at();
  end if;
end $$;

-- Ensure project_date column exists (for existing databases)
do $$ 
begin
  if not exists (
    select 1 
    from information_schema.columns 
    where table_name = 'projects' 
    and column_name = 'project_date'
    and table_schema = 'public'
  ) then
    alter table public.projects add column project_date text not null default 'January 2024';
  end if;
end $$;