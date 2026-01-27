-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.archivos_consulta (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  consulta_id uuid,
  nombre_archivo text NOT NULL,
  url_archivo text NOT NULL,
  tipo_archivo text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT archivos_consulta_pkey PRIMARY KEY (id),
  CONSTRAINT archivos_consulta_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consultas(id)
);
CREATE TABLE public.catalogo_procedimientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  consultorio_id uuid NOT NULL,
  nombre text NOT NULL,
  categoria text NOT NULL,
  precio_base numeric DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT catalogo_procedimientos_pkey PRIMARY KEY (id),
  CONSTRAINT catalogo_procedimientos_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.cie10 (
  codigo text NOT NULL,
  descripcion text NOT NULL,
  activo boolean DEFAULT true,
  CONSTRAINT cie10_pkey PRIMARY KEY (codigo)
);
CREATE TABLE public.citas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL,
  paciente_id uuid NOT NULL,
  fecha_inicio timestamp with time zone NOT NULL,
  fecha_fin timestamp with time zone NOT NULL,
  estado text NOT NULL DEFAULT 'PENDIENTE'::text CHECK (estado = ANY (ARRAY['PENDIENTE'::text, 'COMPLETADA'::text, 'CANCELADA'::text])),
  notas_medicas text,
  archivos_url ARRAY,
  enviar_recordatorio boolean NOT NULL DEFAULT true,
  recordatorio_enviado boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  titulo text,
  consultorio_id uuid,
  tipo_cita text DEFAULT 'CONSULTA'::text CHECK (tipo_cita = ANY (ARRAY['CONSULTA'::text, 'CONTROL'::text])),
  cita_original_id uuid,
  CONSTRAINT citas_pkey PRIMARY KEY (id),
  CONSTRAINT citas_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id),
  CONSTRAINT citas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT citas_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id),
  CONSTRAINT citas_cita_original_id_fkey FOREIGN KEY (cita_original_id) REFERENCES public.citas(id)
);
CREATE TABLE public.consultas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  cita_id uuid,
  paciente_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  fecha_atencion timestamp with time zone DEFAULT now(),
  tipo_consulta text DEFAULT 'GENERAL'::text,
  prioridad text DEFAULT 'MEDIA'::text CHECK (prioridad = ANY (ARRAY['BAJA'::text, 'MEDIA'::text, 'ALTA'::text, 'URGENTE'::text])),
  motivo_consulta text,
  sintomas text,
  diagnostico text,
  prescripcion text,
  notas_internas text,
  peso numeric,
  estatura numeric,
  presion_arterial text,
  glucosa numeric,
  temperatura numeric,
  imc numeric,
  total_cobrado numeric DEFAULT 0,
  estado_pago text DEFAULT 'pendiente'::text CHECK (estado_pago = ANY (ARRAY['PAGADO'::text, 'PENDIENTE'::text, 'ANULADO'::text, 'pagado'::text, 'pendiente'::text, 'anulado'::text])),
  metodo_pago text,
  referencia_pago text,
  consultorio_id uuid,
  CONSTRAINT consultas_pkey PRIMARY KEY (id),
  CONSTRAINT consultas_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.citas(id),
  CONSTRAINT consultas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT consultas_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id),
  CONSTRAINT consultas_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.consultorios (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  nombre text NOT NULL,
  direccion text,
  duracion_cita_minutos integer DEFAULT 30,
  hora_apertura time without time zone DEFAULT '08:00:00'::time without time zone,
  hora_cierre time without time zone DEFAULT '18:00:00'::time without time zone,
  telefono text,
  color_tema text DEFAULT '#3b82f6'::text,
  ruc text,
  slug text UNIQUE,
  logo_url text,
  tipo_consultorio text DEFAULT 'MEDICINA_GENERAL'::text CHECK (tipo_consultorio = ANY (ARRAY['MEDICINA_GENERAL'::text, 'ODONTOLOGIA'::text, 'MIXTO'::text])),
  CONSTRAINT consultorios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.directory_listings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  direccion text,
  telefono text,
  foto_url text,
  especialidad text,
  ciudad text DEFAULT 'General'::text,
  is_verified boolean DEFAULT false,
  consultorio_id uuid,
  views_count integer DEFAULT 0,
  rating numeric DEFAULT 0.0,
  CONSTRAINT directory_listings_pkey PRIMARY KEY (id),
  CONSTRAINT directory_listings_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.especialidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  codigo text UNIQUE,
  icono text,
  requiere_odontograma boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT especialidades_pkey PRIMARY KEY (id)
);
CREATE TABLE public.items_plan_tratamiento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  orden integer NOT NULL DEFAULT 1,
  pieza_dental text,
  procedimiento text NOT NULL,
  descripcion text,
  superficie ARRAY,
  estado text NOT NULL DEFAULT 'PENDIENTE'::text CHECK (estado = ANY (ARRAY['PENDIENTE'::text, 'EN_PROGRESO'::text, 'COMPLETADO'::text, 'CANCELADO'::text])),
  prioridad text DEFAULT 'NORMAL'::text CHECK (prioridad = ANY (ARRAY['URGENTE'::text, 'ALTA'::text, 'NORMAL'::text, 'BAJA'::text])),
  costo numeric DEFAULT 0,
  fecha_programada date,
  fecha_realizado date,
  consulta_id uuid,
  procedimiento_realizado_id uuid,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT items_plan_tratamiento_pkey PRIMARY KEY (id),
  CONSTRAINT items_plan_tratamiento_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.planes_tratamiento(id),
  CONSTRAINT items_plan_tratamiento_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consultas(id),
  CONSTRAINT items_plan_tratamiento_procedimiento_realizado_id_fkey FOREIGN KEY (procedimiento_realizado_id) REFERENCES public.procedimientos_odontologicos(id)
);
CREATE TABLE public.movimientos_caja (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  consultorio_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['INGRESO'::text, 'EGRESO'::text])),
  monto numeric NOT NULL,
  descripcion text,
  fecha timestamp with time zone DEFAULT now(),
  CONSTRAINT movimientos_caja_pkey PRIMARY KEY (id),
  CONSTRAINT movimientos_caja_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id),
  CONSTRAINT movimientos_caja_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.perfiles(id)
);
CREATE TABLE public.odontogramas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  consultorio_id uuid NOT NULL,
  fecha_registro timestamp with time zone NOT NULL DEFAULT now(),
  dientes jsonb NOT NULL DEFAULT '{}'::jsonb,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT odontogramas_pkey PRIMARY KEY (id),
  CONSTRAINT odontogramas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT odontogramas_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.pacientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid,
  nombre_completo text NOT NULL,
  email text,
  telefono text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  cedula text,
  direccion text,
  ciudad text,
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  fecha_nacimiento date,
  sexo text,
  tipo_sangre text,
  antecedentes_patologicos text,
  tratamiento_actual text,
  consultorio_id uuid,
  antecedentes_personales text,
  antecedentes_familiares text,
  antecedentes_quirurgicos text,
  alergias text,
  CONSTRAINT pacientes_pkey PRIMARY KEY (id),
  CONSTRAINT pacientes_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id),
  CONSTRAINT pacientes_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.perfiles (
  id uuid NOT NULL,
  nombre_completo text,
  rol text NOT NULL,
  email text,
  especialidad text,
  consultorio_id uuid,
  numero_resolucion text,
  telefono text,
  foto_url text,
  especialidad_id uuid,
  CONSTRAINT perfiles_pkey PRIMARY KEY (id),
  CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT perfiles_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id),
  CONSTRAINT perfiles_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES public.especialidades(id)
);
CREATE TABLE public.planes_tratamiento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  paciente_id uuid NOT NULL,
  consultorio_id uuid NOT NULL,
  doctor_id uuid,
  titulo text NOT NULL DEFAULT 'Plan de Tratamiento Dental'::text,
  descripcion text,
  estado text NOT NULL DEFAULT 'ACTIVO'::text CHECK (estado = ANY (ARRAY['ACTIVO'::text, 'COMPLETADO'::text, 'CANCELADO'::text, 'EN_PAUSA'::text])),
  costo_estimado numeric DEFAULT 0,
  costo_cubierto numeric DEFAULT 0,
  fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
  fecha_estimada_fin date,
  fecha_completado date,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT planes_tratamiento_pkey PRIMARY KEY (id),
  CONSTRAINT planes_tratamiento_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id),
  CONSTRAINT planes_tratamiento_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id),
  CONSTRAINT planes_tratamiento_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id)
);
CREATE TABLE public.procedimientos_odontologicos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  consulta_id uuid NOT NULL,
  consultorio_id uuid NOT NULL,
  pieza_dental text NOT NULL,
  procedimiento text NOT NULL,
  superficie ARRAY,
  material text,
  costo numeric DEFAULT 0,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT procedimientos_odontologicos_pkey PRIMARY KEY (id),
  CONSTRAINT procedimientos_odontologicos_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consultas(id),
  CONSTRAINT procedimientos_odontologicos_consultorio_id_fkey FOREIGN KEY (consultorio_id) REFERENCES public.consultorios(id)
);
CREATE TABLE public.recepcion_doctores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recepcionista_id uuid,
  doctor_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recepcion_doctores_pkey PRIMARY KEY (id),
  CONSTRAINT recepcion_doctores_recepcionista_id_fkey FOREIGN KEY (recepcionista_id) REFERENCES public.perfiles(id),
  CONSTRAINT recepcion_doctores_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id)
);
CREATE TABLE public.roles (
  id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  nombre text NOT NULL UNIQUE,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vinculacion_personal (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL,
  recepcionista_id uuid NOT NULL,
  CONSTRAINT vinculacion_personal_pkey PRIMARY KEY (id),
  CONSTRAINT vinculacion_personal_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.perfiles(id),
  CONSTRAINT vinculacion_personal_recepcionista_id_fkey FOREIGN KEY (recepcionista_id) REFERENCES public.perfiles(id)
);