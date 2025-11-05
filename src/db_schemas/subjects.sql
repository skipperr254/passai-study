create table public.subjects (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  name text not null,
  color text not null default '#3B82F6'::text,
  description text null,
  test_date date null,
  teacher_emphasis text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint subjects_pkey primary key (id),
  constraint subjects_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_subjects_user_id on public.subjects using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_subjects_created_at on public.subjects using btree (created_at desc) TABLESPACE pg_default;

create trigger update_subjects_updated_at BEFORE
update on subjects for EACH row
execute FUNCTION update_updated_at_column ();