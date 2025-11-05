create table public.topic_mastery (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  topic_id uuid not null,
  subject_id uuid not null,
  mastery_level numeric(5, 2) not null default 0,
  total_quizzes_taken integer not null default 0,
  quizzes_passed integer not null default 0,
  average_quiz_score numeric(5, 2) not null default 0,
  last_quiz_score numeric(5, 2) null,
  trend text not null default 'unknown'::text,
  last_studied_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint topic_mastery_pkey primary key (id),
  constraint topic_mastery_user_id_topic_id_key unique (user_id, topic_id),
  constraint topic_mastery_topic_id_fkey foreign KEY (topic_id) references topics (id) on delete CASCADE,
  constraint topic_mastery_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint topic_mastery_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint topic_mastery_mastery_level_check check (
    (
      (mastery_level >= (0)::numeric)
      and (mastery_level <= (100)::numeric)
    )
  ),
  constraint topic_mastery_trend_check check (
    (
      trend = any (
        array[
          'up'::text,
          'down'::text,
          'stable'::text,
          'unknown'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_topic_mastery_user_id on public.topic_mastery using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_topic_mastery_topic_id on public.topic_mastery using btree (topic_id) TABLESPACE pg_default;

create index IF not exists idx_topic_mastery_subject_id on public.topic_mastery using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_topic_mastery_user_subject on public.topic_mastery using btree (user_id, subject_id) TABLESPACE pg_default;

create trigger update_topic_mastery_updated_at BEFORE
update on topic_mastery for EACH row
execute FUNCTION update_updated_at_column ();