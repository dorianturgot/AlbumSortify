create table if not exists album
(
    id           int auto_increment
        primary key,
    userID       varchar(100)                       not null,
    name         varchar(100)                       not null,
    date_created datetime default CURRENT_TIMESTAMP not null,
    artist       varchar(100)                       not null,
    picture_url  varchar(200)                       not null,
    url          varchar(200)                       not null,
    releaseDate  varchar(50)                        not null,
    spotifyID    varchar(100)                       not null,
    listID       int                                not null,
    total_tracks int                                not null,
    constraint name
        unique (name, userID, listID)
);

create table if not exists albumlist
(
    id           int auto_increment
        primary key,
    name         varchar(50)                        not null,
    userID       varchar(100)                       not null,
    date_created datetime default CURRENT_TIMESTAMP not null,
    color        varchar(50)                        not null,
    constraint albumlist_pk2
        unique (userID, name)
);


