# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table stats_entry_x01 (
  id                        bigint not null,
  timestamp                 bigint,
  game                      varchar(255),
  set                       varchar(255),
  leg                       varchar(255),
  entry                     varchar(255),
  entry_index               integer,
  player                    varchar(255),
  score                     integer,
  left                      integer,
  status                    varchar(6),
  nb_darts                  integer,
  leg_nb_darts              integer,
  constraint ck_stats_entry_x01_status check (status in ('normal','broken','win')),
  constraint pk_stats_entry_x01 primary key (id))
;

create sequence stats_entry_x01_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists stats_entry_x01;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists stats_entry_x01_seq;

