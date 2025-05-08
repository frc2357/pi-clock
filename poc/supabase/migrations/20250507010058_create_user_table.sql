create table public.user (
    id int generated always as identity primary key,
    nfc_id text not null,
    first_name text not null,
    last_name text not null,
    class_year int not null,
    email text not null
);