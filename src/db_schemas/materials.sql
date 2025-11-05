create table public.materials (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  subject_id uuid not null,
  name text not null,
  type text not null,
  file_path text not null,
  file_size bigint not null,
  thumbnail_url text null,
  status text not null default 'pending'::text,
  metadata jsonb null,
  uploaded_at timestamp with time zone not null default now(),
  processed_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  mime_type text null,
  extracted_text text null,
  page_count numeric null,
  duration_seconds numeric null,
  constraint materials_pkey primary key (id),
  constraint materials_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint materials_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint materials_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'processing'::text,
          'completed'::text,
          'failed'::text
        ]
      )
    )
  ),
  constraint materials_type_check check (
    (
      type = any (
        array[
          'pdf'::text,
          'video'::text,
          'image'::text,
          'document'::text,
          'notes'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_materials_user_id on public.materials using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_materials_subject_id on public.materials using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_materials_status on public.materials using btree (status) TABLESPACE pg_default;

create index IF not exists idx_materials_uploaded_at on public.materials using btree (uploaded_at desc) TABLESPACE pg_default;

create trigger update_materials_updated_at BEFORE
update on materials for EACH row
execute FUNCTION update_updated_at_column ();