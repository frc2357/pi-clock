create table public.timeclock_event (
    id serial primary key,
    nfc_id text not null,
    clock_in timestamptz,
    clock_out timestamptz,

    constraint timeclock_event_nfc_id_fkey foreign key (nfc_id) references public.user_profile(nfc_id)
);