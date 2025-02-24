--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

-- Started on 2025-02-05 12:17:53 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 851 (class 1247 OID 57352)
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 57346)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 57367)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    jti character varying NOT NULL,
    sub character varying NOT NULL,
    iat timestamp with time zone NOT NULL,
    exp timestamp with time zone NOT NULL,
    user_agent character varying,
    ip_address character varying,
    revoked boolean NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 57357)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying NOT NULL,
    role public.role NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3377 (class 0 OID 57346)
-- Dependencies: 217
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
6e7a1710d4ac
\.


--
-- TOC entry 3379 (class 0 OID 57367)
-- Dependencies: 219
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (jti, sub, iat, exp, user_agent, ip_address, revoked) FROM stdin;
2c5c26dd-6a6c-470f-8707-03cb3ef4136d	97ea58f4-e36a-4aba-90c2-97dd91f01780	2025-02-05 07:33:24.328183+00	2025-02-12 07:33:24.326196+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0	127.0.0.1	f
24e2fd02-3bc9-4786-9f44-2cca4aa99759	97ea58f4-e36a-4aba-90c2-97dd91f01780	2025-02-05 11:31:07.165104+00	2025-02-12 11:31:07.163037+00	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0	127.0.0.1	t
\.


--
-- TOC entry 3378 (class 0 OID 57357)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, full_name, role) FROM stdin;
4cf66f42-1400-463a-b80c-7f837aff77b9	mark	$argon2id$v=19$m=65536,t=3,p=4$fu9dS2mNMcaYc+5dizHGGA$2wg91QsGkiHRuXBQl4YFnNMG7hMIQAelg7Oyx/g2ynI	Mark Nguyen	user
97ea58f4-e36a-4aba-90c2-97dd91f01780	dung	$argon2id$v=19$m=65536,t=3,p=4$bA3BOEco5XyvtXZO6d07hw$pBn9WP3ryVNd0V1kkSOhDNLKNz18h5KjBTLyP1EDwoI	Nguyễn Văn Dũng	admin
a6d83c1c-885b-4b92-8344-794608efe83e	string	$argon2id$v=19$m=65536,t=3,p=4$3FtLKWXs/T+nNOZcC8HYuw$X20GvrYdd4U4oYkiy5HS5iVpCi/a9CUmcMrS+lPEM9s	string	user
\.


--
-- TOC entry 3221 (class 2606 OID 57350)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 3230 (class 2606 OID 57373)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (jti);


--
-- TOC entry 3224 (class 2606 OID 57363)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3226 (class 2606 OID 57365)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3227 (class 1259 OID 57379)
-- Name: ix_refresh_tokens_jti; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_refresh_tokens_jti ON public.refresh_tokens USING btree (jti);


--
-- TOC entry 3228 (class 1259 OID 57380)
-- Name: ix_refresh_tokens_sub; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_refresh_tokens_sub ON public.refresh_tokens USING btree (sub);


--
-- TOC entry 3222 (class 1259 OID 57366)
-- Name: ix_users_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_user_id ON public.users USING btree (user_id);


--
-- TOC entry 3231 (class 2606 OID 57374)
-- Name: refresh_tokens refresh_tokens_sub_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_sub_fkey FOREIGN KEY (sub) REFERENCES public.users(user_id);


-- Completed on 2025-02-05 12:17:53 UTC

--
-- PostgreSQL database dump complete
--

