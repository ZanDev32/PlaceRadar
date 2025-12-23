-- 1. TABEL UTAMA: USER (Induk data pengguna)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,              -- ID Unik untuk setiap user (Auto Increment)
    username VARCHAR(50) NOT NULL UNIQUE, -- Nama unik untuk identitas login
    email VARCHAR(100) NOT NULL UNIQUE, -- Email unik untuk akun user
    password VARCHAR(255) NOT NULL      -- Tempat simpan password yang sudah di-hash
);

-- 2. TABEL UTAMA: LOCATIONS (Induk data tempat/kafe)
CREATE TABLE locations (
    id VARCHAR(50) PRIMARY KEY,         -- ID Lokasi (diambil dari JSON ID)
    name VARCHAR(255) NOT NULL,         -- Nama kafe atau co-working space
    description TEXT,                   -- Penjelasan detail tentang tempat tersebut
    address TEXT,                       -- Alamat lengkap lokasi
    lat DECIMAL(10, 8),                 -- Titik koordinat Lintang (Latitude)
    lng DECIMAL(11, 8),                 -- Titik koordinat Bujur (Longitude)
    type VARCHAR(50),                   -- Tipe tempat (misal: Coffee Shop atau Coworking)
    pricing_amount INT,                 -- Minimal biaya yang dikeluarkan (Min Spend)
    wifi_speed_mbps INT DEFAULT 0,      -- Informasi kecepatan internet
    outlet_per_table INT,               -- Jumlah colokan listrik per meja
    -- FASILITAS (Boolean: true/false)
    pet_friendly BOOLEAN DEFAULT FALSE, -- Apakah boleh bawa hewan peliharaan?
    smoking_area BOOLEAN DEFAULT FALSE, -- Apakah tersedia area merokok?
    board_games BOOLEAN DEFAULT FALSE,  -- Apakah tersedia permainan meja?
    ac BOOLEAN DEFAULT FALSE,           -- Apakah ruangan ber-AC?
    meeting_room BOOLEAN DEFAULT FALSE, -- Apakah tersedia ruang rapat?
    meals_available BOOLEAN DEFAULT FALSE, -- Apakah tersedia makanan berat?
    prayer_room BOOLEAN DEFAULT FALSE,  -- Apakah tersedia mushola?
    -- STATISTIK (Data ringkasan untuk tampilan cepat)
    rating_average DECIMAL(3, 2) DEFAULT 0, -- Rata-rata bintang dari semua user
    review_count INT DEFAULT 0,         -- Total berapa kali tempat ini diulas
    save_count INT DEFAULT 0,           -- Total berapa kali tempat ini difavoritkan
    like_count INT DEFAULT 0,           -- Total berapa kali tempat ini disukai (like)
    -- INFORMASI TAMBAHAN
    opening_weekday VARCHAR(50),        -- Jam operasional Senin-Jumat
    opening_weekend VARCHAR(50),        -- Jam operasional Sabtu-Minggu
    instagram TEXT,                     -- Link profil media sosial
    is_24_hours BOOLEAN DEFAULT FALSE   -- Apakah buka 24 jam?
);

-- 3. TABEL RELASI: FAVORIT (Jembatan Many-to-Many antara User & Lokasi)
-- Menjelaskan: "1 User bisa favoritkan BANYAK Lokasi" & "1 Lokasi bisa difavoritkan BANYAK User"
CREATE TABLE user_favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,           -- FK ke tabel User (Jika user dihapus, data ini ikut hapus)
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE, -- FK ke tabel Location (Jika lokasi dihapus, data ini ikut hapus)
    PRIMARY KEY (user_id, location_id)                             -- Gabungan ID ini unik: 1 User tidak bisa favoritkan tempat yang sama 2 kali
);

-- 4. TABEL RELASI: REVIEWS (Jembatan Many-to-Many dengan data tambahan)
-- Menjelaskan: "1 User bisa review BANYAK Tempat" & "1 Tempat bisa di-review BANYAK User"
CREATE TABLE user_reviews (
    id SERIAL PRIMARY KEY,                                        -- ID Unik untuk setiap ulasan
    user_id INT REFERENCES users(id) ON DELETE CASCADE,           -- Siapa yang memberi ulasan?
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE CASCADE, -- Tempat mana yang diulas?
    rating INT CHECK (rating >= 1 AND rating <= 5),               -- Isi bintang (Harus 1 sampai 5)
    comment TEXT,                                                 -- Isi ulasan atau komentar dari user
    is_like BOOLEAN DEFAULT FALSE,                                -- Apakah user juga memberi "Like" (Jempol)?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,               -- Kapan ulasan ini dibuat?
    UNIQUE (user_id, location_id)                                 -- Aturan: 1 User hanya boleh beri 1 ulasan untuk 1 tempat tertentu
);