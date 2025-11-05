create table public.question_responses (
  id uuid not null default extensions.uuid_generate_v4 (),
  attempt_id uuid not null,
  question_id uuid not null,
  user_answer jsonb not null,
  is_correct boolean not null default false,
  points_earned integer not null default 0,
  time_spent integer not null default 0,
  answered_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint question_responses_pkey primary key (id),
  constraint question_responses_attempt_id_fkey foreign KEY (attempt_id) references quiz_attempts (id) on delete CASCADE,
  constraint question_responses_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_question_responses_attempt_id on public.question_responses using btree (attempt_id) TABLESPACE pg_default;

create index IF not exists idx_question_responses_question_id on public.question_responses using btree (question_id) TABLESPACE pg_default;