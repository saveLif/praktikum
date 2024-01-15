--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: description; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.description (
    id integer NOT NULL,
    name_id integer NOT NULL,
    origin text NOT NULL,
    leaf_shape text NOT NULL,
    general_description text NOT NULL
);


ALTER TABLE public.description OWNER TO julian1234;

--
-- Name: flowering_time; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.flowering_time (
    month smallint NOT NULL,
    description_id integer NOT NULL
);


ALTER TABLE public.flowering_time OWNER TO julian1234;

--
-- Name: game; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.game (
    id integer NOT NULL,
    points integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL
);


ALTER TABLE public.game OWNER TO julian1234;

--
-- Name: geolocation; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.geolocation (
    id integer NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL
);


ALTER TABLE public.geolocation OWNER TO julian1234;

--
-- Name: located; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.located (
    object_id integer NOT NULL,
    sensor_id integer NOT NULL
);


ALTER TABLE public.located OWNER TO julian1234;

--
-- Name: location; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.location (
    id integer NOT NULL,
    geolocation_id integer NOT NULL,
    height integer NOT NULL
);


ALTER TABLE public.location OWNER TO julian1234;

--
-- Name: measured_values; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.measured_values (
    id integer NOT NULL,
    value integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    sensor_id integer NOT NULL
);


ALTER TABLE public.measured_values OWNER TO julian1234;

--
-- Name: name; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.name (
    id integer NOT NULL,
    german text NOT NULL,
    botanical text NOT NULL
);


ALTER TABLE public.name OWNER TO julian1234;

--
-- Name: object; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.object (
    id integer NOT NULL,
    description text NOT NULL,
    geolocation_id integer NOT NULL,
    description_id integer NOT NULL
);


ALTER TABLE public.object OWNER TO julian1234;

--
-- Name: reservation; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.reservation (
    user_id integer NOT NULL,
    object_id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL
);


ALTER TABLE public.reservation OWNER TO julian1234;

--
-- Name: sensor; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.sensor (
    id integer NOT NULL,
    measured_variable text NOT NULL,
    installation_date date NOT NULL,
    location_id integer NOT NULL,
    CONSTRAINT sensor_measured_variable_check CHECK ((measured_variable = ANY (ARRAY['humidity'::text, 'temperature'::text, 'light'::text])))
);


ALTER TABLE public.sensor OWNER TO julian1234;

--
-- Name: sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: julian1234
--

ALTER TABLE public.sensor ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sensor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tree; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.tree (
    object_id integer NOT NULL,
    points integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL
);


ALTER TABLE public.tree OWNER TO julian1234;

--
-- Name: userprofil; Type: TABLE; Schema: public; Owner: julian1234
--

CREATE TABLE public.userprofil (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    pseudonym text NOT NULL,
    token text DEFAULT 'Logout'::text NOT NULL,
    user_picture bytea,
    status text DEFAULT 'User'::text NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    CONSTRAINT userprofil_status_check CHECK ((status = ANY (ARRAY['User'::text, 'Dienstleister'::text, 'Admin'::text])))
);


ALTER TABLE public.userprofil OWNER TO julian1234;

--
-- Name: userprofil_id_seq; Type: SEQUENCE; Schema: public; Owner: julian1234
--

ALTER TABLE public.userprofil ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.userprofil_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: description description_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (id);


--
-- Name: geolocation geolocation_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.geolocation
    ADD CONSTRAINT geolocation_pkey PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: measured_values measured_values_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.measured_values
    ADD CONSTRAINT measured_values_pkey PRIMARY KEY (id);


--
-- Name: name name_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.name
    ADD CONSTRAINT name_pkey PRIMARY KEY (id);


--
-- Name: object object_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.object
    ADD CONSTRAINT object_pkey PRIMARY KEY (id);


--
-- Name: sensor sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- Name: userprofil userprofil_pkey; Type: CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.userprofil
    ADD CONSTRAINT userprofil_pkey PRIMARY KEY (id);


--
-- Name: flowering_time flowering_time_description_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.flowering_time
    ADD CONSTRAINT flowering_time_description_id_fkey FOREIGN KEY (description_id) REFERENCES public.description(id);


--
-- Name: game game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_id_fkey FOREIGN KEY (id) REFERENCES public.userprofil(id);


--
-- Name: located located_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.located
    ADD CONSTRAINT located_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.object(id);


--
-- Name: located located_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.located
    ADD CONSTRAINT located_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensor(id);


--
-- Name: location location_geolocation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_geolocation_id_fkey FOREIGN KEY (geolocation_id) REFERENCES public.geolocation(id);


--
-- Name: measured_values measured_values_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.measured_values
    ADD CONSTRAINT measured_values_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensor(id);


--
-- Name: object object_description_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.object
    ADD CONSTRAINT object_description_id_fkey FOREIGN KEY (description_id) REFERENCES public.description(id);


--
-- Name: object object_geolocation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.object
    ADD CONSTRAINT object_geolocation_id_fkey FOREIGN KEY (geolocation_id) REFERENCES public.geolocation(id);


--
-- Name: reservation reservation_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.object(id);


--
-- Name: reservation reservation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userprofil(id);


--
-- Name: sensor sensor_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id);


--
-- Name: tree tree_object_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: julian1234
--

ALTER TABLE ONLY public.tree
    ADD CONSTRAINT tree_object_id_fkey FOREIGN KEY (object_id) REFERENCES public.object(id);


--
-- PostgreSQL database dump complete
--

