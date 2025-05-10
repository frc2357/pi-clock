create table public.user (
    id int generated always as identity primary key,
    nfc_id text not null,
    email text not null unique,
    display_name text,
    profile_pic_url text
);