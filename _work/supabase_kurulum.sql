-- ================================================================
-- Ali Usta Baklavaları — Supabase kurulumu
-- Supabase panelinde: SQL Editor > New query > bunu yapıştır > Run
-- ================================================================

-- 1) "Türüne göre, tek tek" fotoğraf/video ekleme (site.js zaten bu
--    tabloyu okuyup yazıyor, sadece tablo eksikti)
create table if not exists tur_medya (
  id bigint generated always as identity primary key,
  tur text not null,
  baslik text,
  medya_url text not null,
  medya_tip text not null default 'image',
  olusturma timestamptz not null default now()
);
alter table tur_medya enable row level security;
drop policy if exists "herkes okuyabilir" on tur_medya;
create policy "herkes okuyabilir" on tur_medya for select using (true);
drop policy if exists "herkes ekleyebilir" on tur_medya;
create policy "herkes ekleyebilir" on tur_medya for insert with check (true);

-- 2) Menü sayfası — eklenen tatlılar
create table if not exists menu_ekle (
  id text primary key,
  cat text not null,
  name text not null,
  price text not null,
  photo_url text,
  created_at timestamptz not null default now()
);
alter table menu_ekle enable row level security;
drop policy if exists "herkes okuyabilir" on menu_ekle;
create policy "herkes okuyabilir" on menu_ekle for select using (true);
drop policy if exists "herkes ekleyebilir" on menu_ekle;
create policy "herkes ekleyebilir" on menu_ekle for insert with check (true);
drop policy if exists "herkes silebilir" on menu_ekle;
create policy "herkes silebilir" on menu_ekle for delete using (true);

-- 3) Menü sayfası — fiyat değişiklikleri (mevcut ürünler dahil)
create table if not exists menu_fiyat (
  id text primary key,
  fiyat text not null,
  updated_at timestamptz not null default now()
);
alter table menu_fiyat enable row level security;
drop policy if exists "herkes okuyabilir" on menu_fiyat;
create policy "herkes okuyabilir" on menu_fiyat for select using (true);
drop policy if exists "herkes yazabilir" on menu_fiyat;
create policy "herkes yazabilir" on menu_fiyat for insert with check (true);
drop policy if exists "herkes guncelleyebilir" on menu_fiyat;
create policy "herkes guncelleyebilir" on menu_fiyat for update using (true);

-- 4) Fotoğraf/video dosyalarının konduğu depo (storage bucket)
insert into storage.buckets (id, name, public)
values ('hikaye-medya', 'hikaye-medya', true)
on conflict (id) do nothing;

drop policy if exists "herkes gorebilir" on storage.objects;
create policy "herkes gorebilir" on storage.objects for select
  using (bucket_id = 'hikaye-medya');
drop policy if exists "herkes yukleyebilir" on storage.objects;
create policy "herkes yukleyebilir" on storage.objects for insert
  with check (bucket_id = 'hikaye-medya');
