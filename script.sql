create table users
(
    id          serial                                              not null
        constraint users_pk
            primary key,
    username    varchar(60)                                         not null,
    password    varchar(255)                                        not null,
    name        varchar(100) default 'Anonymous'::character varying not null,
    "updatedAt" timestamp    default CURRENT_TIMESTAMP              not null,
    "createdAt" timestamp    default CURRENT_TIMESTAMP              not null,
    email       varchar(255)                                        not null
);

alter table users
    owner to pixel;

create unique index users_username_uindex
    on users (username);

create unique index users_email_uindex
    on users (email);

create table chats
(
    id               serial       not null
        constraint chats_pk
            primary key,
    id_chat          varchar(256) not null,
    id_user          integer      not null
        constraint id_user_fk
            references users,
    "createdAt"      timestamp default CURRENT_TIMESTAMP,
    "updatedAt"      timestamp default CURRENT_TIMESTAMP,
    "numberOfUnread" integer   default 0
        constraint ck_chats_col
            check ("numberOfUnread" >= 0)
);

alter table chats
    owner to pixel;

create index chats_id_user_index
    on chats (id_user);

create index chats_id_chat_index
    on chats (id_chat);

create table messages
(
    id          serial       not null
        constraint messages_pk
            primary key,
    message     text         not null,
    id_sender   integer      not null
        constraint messages_users_id_fk
            references users,
    id_chat     varchar(256) not null,
    "updatedAt" timestamp default CURRENT_TIMESTAMP,
    "createdAt" timestamp default CURRENT_TIMESTAMP,
    img         boolean   default false
);

alter table messages
    owner to pixel;

create unique index messages_id_uindex
    on messages (id);


