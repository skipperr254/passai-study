create table public.quizzes (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  subject_id uuid not null,
  title text not null,
  description text null,
  mode text not null default 'practice'::text,
  status text not null default 'draft'::text,
  difficulty text not null default 'medium'::text,
  time_limit integer null,
  passing_score integer null,
  question_count integer not null default 0,
  total_points integer not null default 0,
  scheduled_for timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  settings jsonb null,
  constraint quizzes_pkey primary key (id),
  constraint quizzes_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint quizzes_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint quizzes_difficulty_check check (
    (
      difficulty = any (array['easy'::text, 'medium'::text, 'hard'::text])
    )
  ),
  constraint quizzes_mode_check check (
    (
      mode = any (
        array[
          'practice'::text,
          'test'::text,
          'timed'::text,
          'adaptive'::text
        ]
      )
    )
  ),
  constraint quizzes_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'ready'::text,
          'in-progress'::text,
          'completed'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_quizzes_user_id on public.quizzes using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quizzes_subject_id on public.quizzes using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_quizzes_status on public.quizzes using btree (status) TABLESPACE pg_default;

create index IF not exists idx_quizzes_created_at on public.quizzes using btree (created_at desc) TABLESPACE pg_default;

create trigger update_quizzes_updated_at BEFORE
update on quizzes for EACH row
execute FUNCTION update_updated_at_column ();