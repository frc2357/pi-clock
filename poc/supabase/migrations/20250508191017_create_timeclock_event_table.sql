create table public.timeclock_event (
    id int generated always as identity primary key,
    user_id int not null references public.user(id),
    clock_in timestamptz,
    clock_out timestamptz
);