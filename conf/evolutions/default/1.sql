# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table stats_entry_x01 (
  id                        bigint not null,
  entry_timestamp           bigint,
  game_id                   varchar(255),
  set_id                    varchar(255),
  leg_id                    varchar(255),
  entry_id                  varchar(255),
  entry_index               integer,
  player_id                 varchar(255),
  score_done                integer,
  score_left                integer,
  throw_status              varchar(6),
  nb_darts                  integer,
  leg_nb_darts              integer,
  constraint ck_stats_entry_x01_throw_status check (throw_status in ('normal','broken','win')),
  constraint pk_stats_entry_x01 primary key (id))
;

create sequence stats_entry_x01_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists stats_entry_x01;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists stats_entry_x01_seq;

