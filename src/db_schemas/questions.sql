create table public.questions (
  id uuid not null default extensions.uuid_generate_v4 (),
  quiz_id uuid not null,
  type text not null,
  difficulty text not null default 'medium'::text,
  question text not null,
  options jsonb null,
  correct_answer jsonb not null,
  explanation text null,
  points integer not null default 1,
  order_index integer not null,
  tags text[] null,
  material_references uuid[] null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  source_excerpt text null,
  source_page text null,
  source_material_id uuid null,
  topic text null,
  topic_id uuid null,
  constraint questions_pkey primary key (id),
  constraint questions_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE,
  constraint questions_source_material_id_fkey foreign KEY (source_material_id) references materials (id),
  constraint questions_topic_id_fkey foreign KEY (topic_id) references topics (id) on delete set null,
  constraint questions_difficulty_check check (
    (
      difficulty = any (array['easy'::text, 'medium'::text, 'hard'::text])
    )
  ),
  constraint questions_type_check check (
    (
      type = any (
        array[
          'multiple-choice'::text,
          'true-false'::text,
          'short-answer'::text,
          'essay'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_questions_quiz_id on public.questions using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_questions_order_index on public.questions using btree (order_index) TABLESPACE pg_default;

create index IF not exists idx_questions_topic_id on public.questions using btree (topic_id) TABLESPACE pg_default;

create trigger update_questions_updated_at BEFORE
update on questions for EACH row
execute FUNCTION update_updated_at_column ();