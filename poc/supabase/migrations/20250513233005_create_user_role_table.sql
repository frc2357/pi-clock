create table public.user_role (
    id serial primary key,
    description text not null
);

insert into public.user_role (description)
values ('admin');

insert into public.user_role (description)
values ('mentor');

insert into public.user_role (description)
values ('student');