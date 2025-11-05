create table public.topics (
  id uuid not null default extensions.uuid_generate_v4 (),
  subject_id uuid not null,
  name text not null,
  description text null,
  difficulty text not null default 'medium'::text,
  estimated_study_time integer null default 30,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint topics_pkey primary key (id),
  constraint topics_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint topics_difficulty_check check (
    (
      difficulty = any (
        array[
          'beginner'::text,
          'intermediate'::text,
          'advanced'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_topics_subject_id on public.topics using btree (subject_id) TABLESPACE pg_default;

create trigger update_topics_updated_at BEFORE
update on topics for EACH row
execute FUNCTION update_updated_at_column ();