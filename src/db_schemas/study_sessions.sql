create table public.study_sessions (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  subject_id uuid null,
  duration integer not null default 0,
  activities_completed integer not null default 0,
  focus_score integer null,
  mood text null,
  notes text null,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint study_sessions_pkey primary key (id),
  constraint study_sessions_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete set null,
  constraint study_sessions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint study_sessions_focus_score_check check (
    (
      (focus_score >= 0)
      and (focus_score <= 100)
    )
  ),
  constraint study_sessions_mood_check check (
    (
      mood = any (
        array[
          'happy'::text,
          'neutral'::text,
          'frustrated'::text,
          'tired'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_study_sessions_user_id on public.study_sessions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_study_sessions_subject_id on public.study_sessions using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_study_sessions_started_at on public.study_sessions using btree (started_at desc) TABLESPACE pg_default;

create trigger update_study_sessions_updated_at BEFORE
update on study_sessions for EACH row
execute FUNCTION update_updated_at_column ();