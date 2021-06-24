create table users
(
	id serial not null
		constraint users_pk
			primary key,
	username varchar(60) not null,
	password varchar(255) not null,
	name varchar(100) default 'Anonymous'::character varying not null,
	"updatedAt" timestamp default CURRENT_TIMESTAMP not null,
	"createdAt" timestamp default CURRENT_TIMESTAMP not null
);

alter table users owner to pixel;

create unique index users_username_uindex
	on users (username);

