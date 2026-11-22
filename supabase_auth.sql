-- ==============================================================================
-- KARGON — Base de datos de AUTENTICACIÓN (login / registro con roles)
-- ==============================================================================
-- Cómo usarlo:
--   1. Entra a tu proyecto en https://app.supabase.com
--   2. Menú lateral → SQL Editor → New query → pega TODO este archivo → Run
--   3. Menú lateral → Authentication → Providers → activa "Email"
--      (desactiva "Confirm email" si quieres que el registro sea inmediato en la demo)
--
-- Por qué así: Supabase Auth gestiona los correos y las CONTRASEÑAS de forma
-- segura (encriptadas) en la tabla interna auth.users. Nosotros solo guardamos
-- los datos del perfil (nombre, empresa y rol) en la tabla "perfiles".
-- Nunca se guardan contraseñas en texto plano.
-- ==============================================================================

-- 1. Tabla de perfiles, ligada 1 a 1 con los usuarios de Supabase Auth
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  empresa TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('proveedor', 'dueno_galpon', 'transportista')),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seguridad a nivel de fila: cada quien ve y edita solo su propio perfil
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perfil_propio_select" ON public.perfiles;
CREATE POLICY "perfil_propio_select" ON public.perfiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "perfil_propio_update" ON public.perfiles;
CREATE POLICY "perfil_propio_update" ON public.perfiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "perfil_propio_insert" ON public.perfiles;
CREATE POLICY "perfil_propio_insert" ON public.perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Crear el perfil automáticamente cuando alguien se registra
--    (lee el nombre, la empresa y el rol enviados al momento del registro)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, empresa, rol, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'),
    NEW.raw_user_meta_data->>'empresa',
    COALESCE(NEW.raw_user_meta_data->>'rol', 'proveedor'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Listo. A partir de aquí, cada registro desde la app crea:
--   • 1 usuario en auth.users (con su correo y contraseña encriptada)
--   • 1 fila en public.perfiles (con su nombre, empresa y rol)
-- ==============================================================================
