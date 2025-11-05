create table public.quiz_attempts (
  id uuid not null default extensions.uuid_generate_v4 (),
  quiz_id uuid not null,
  user_id uuid not null,
  status text not null default 'in-progress'::text,
  score integer not null default 0,
  percentage numeric(5, 2) not null default 0,
  time_spent integer not null default 0,
  started_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  mood_at_midpoint character varying(20) null,
  energy_level integer null,
  constraint quiz_attempts_pkey primary key (id),
  constraint quiz_attempts_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE,
  constraint quiz_attempts_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint quiz_attempts_energy_level_check check (
    (
      (energy_level >= 1)
      and (energy_level <= 10)
    )
  ),
  constraint quiz_attempts_mood_at_midpoint_check check (
    (
      (mood_at_midpoint)::text = any (
        (
          array[
            'confident'::character varying,
            'okay'::character varying,
            'struggling'::character varying,
            'confused'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint quiz_attempts_status_check check (
    (
      status = any (
        array[
          'in-progress'::text,
          'completed'::text,
          'abandoned'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_user_id on public.quiz_attempts using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_quiz_id on public.quiz_attempts using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_status on public.quiz_attempts using btree (status) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_started_at on public.quiz_attempts using btree (started_at desc) TABLESPACE pg_default;

create trigger on_quiz_attempt_completed
after INSERT
or
update on quiz_attempts for EACH row
execute FUNCTION update_subject_progress_after_quiz ();

create trigger on_quiz_attempt_completed_update_topic_mastery
after INSERT
or
update on quiz_attempts for EACH row
execute FUNCTION update_topic_mastery_after_quiz ();

create trigger update_quiz_attempts_updated_at BEFORE
update on quiz_attempts for EACH row
execute FUNCTION update_updated_at_column ();