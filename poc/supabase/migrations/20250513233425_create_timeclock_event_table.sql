create table public.timeclock_event (
    id int primary key not null,
    user_id int not null,
    clock_in timestamptz,
    clock_out timestamptz,

    constraint timeclock_event_user_uid_fkey foreign key (user_id) references public.user_profile(id)
);