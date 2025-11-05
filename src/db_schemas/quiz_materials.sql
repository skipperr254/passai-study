create table public.quiz_materials (
  id uuid not null default extensions.uuid_generate_v4 (),
  quiz_id uuid not null,
  material_id uuid not null,
  created_at timestamp with time zone not null default now(),
  constraint quiz_materials_pkey primary key (id),
  constraint quiz_materials_quiz_id_material_id_key unique (quiz_id, material_id),
  constraint quiz_materials_material_id_fkey foreign KEY (material_id) references materials (id) on delete CASCADE,
  constraint quiz_materials_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_quiz_materials_quiz_id on public.quiz_materials using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_materials_material_id on public.quiz_materials using btree (material_id) TABLESPACE pg_default;