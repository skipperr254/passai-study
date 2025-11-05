create table public.study_tasks (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  subject_id uuid not null,
  topic_id uuid null,
  title text not null,
  description text not null,
  type text not null,
  priority text not null default 'medium'::text,
  estimated_time integer not null default 15,
  time_spent integer not null default 0,
  status text not null default 'pending'::text,
  completed_at timestamp with time zone null,
  requires_verification boolean not null default false,
  verification_status text null,
  verification_quiz_id uuid null,
  due_date date null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint study_tasks_pkey primary key (id),
  constraint study_tasks_topic_id_fkey foreign KEY (topic_id) references topics (id) on delete set null,
  constraint study_tasks_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint study_tasks_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint study_tasks_verification_quiz_id_fkey foreign KEY (verification_quiz_id) references quizzes (id) on delete set null,
  constraint study_tasks_type_check check (
    (
      type = any (
        array[
          'review'::text,
          'practice'::text,
          'quiz'::text,
          'flashcards'::text,
          'material'::text
        ]
      )
    )
  ),
  constraint study_tasks_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'in-progress'::text,
          'completed'::text,
          'skipped'::text
        ]
      )
    )
  ),
  constraint study_tasks_verification_status_check check (
    (
      verification_status = any (
        array[
          'pending'::text,
          'passed'::text,
          'failed'::text,
          'skipped'::text
        ]
      )
    )
  ),
  constraint study_tasks_priority_check check (
    (
      priority = any (array['high'::text, 'medium'::text, 'low'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_user_id on public.study_tasks using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_subject_id on public.study_tasks using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_topic_id on public.study_tasks using btree (topic_id) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_status on public.study_tasks using btree (status) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_due_date on public.study_tasks using btree (due_date) TABLESPACE pg_default;

create index IF not exists idx_study_tasks_user_status on public.study_tasks using btree (user_id, status) TABLESPACE pg_default;

create trigger update_study_tasks_updated_at BEFORE
update on study_tasks for EACH row
execute FUNCTION update_updated_at_column ();