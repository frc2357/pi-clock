create table public.user_profile (
    id serial primary key,
    user_uid uuid not null,
    user_role_id int,
    display_name text not null,
    nfc_id text unique,
    show_realtime_clockins boolean default false,

    constraint user_profile_user_uid_fkey foreign key (user_uid) references auth.users(id) on delete cascade,
    constraint user_profile_user_role_id_fkey foreign key (user_role_id) references public.user_role(id)
);