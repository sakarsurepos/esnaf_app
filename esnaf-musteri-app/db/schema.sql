-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    profile_image TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT now()
);


-- USER SETTINGS
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'en',
    theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    preferred_currency TEXT DEFAULT 'TRY',
    preferred_location TEXT,
    custom_preferences JSONB,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- USER ROLES
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE
);

-- SERVICE TYPES
CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- BUSINESSES
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT now()
);

-- BUSINESS PAYOUT ACCOUNTS
CREATE TABLE business_payout_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    provider TEXT CHECK (provider IN ('stripe', 'paypal', 'iban')) NOT NULL,
    account_identifier TEXT NOT NULL,
    account_name TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- BRANCHES
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now()
);

-- STAFF MEMBERS
CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    position TEXT,
    expertise TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE business_staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL -- Örnek: 'manager', 'cashier', 'receptionist'
);

CREATE TABLE staff_member_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    role_id UUID REFERENCES business_staff_roles(id) ON DELETE CASCADE
);

-- STAFF PROFILES
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    about TEXT,
    experience_years INTEGER,
    average_rating NUMERIC(3,2),
    total_services INTEGER
);

-- STAFF SCHEDULE EXCEPTIONS
CREATE TABLE staff_schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    time_range TEXT,
    reason TEXT,
    is_working_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now()
);

-- STAFF PERFORMANCE LOGS
CREATE TABLE staff_performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    source TEXT,
    points INTEGER DEFAULT 0,
    comment TEXT,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT now()
);

-- BLOCKED DATES
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason TEXT
);

-- SERVICE CATEGORIES
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff_members(id) ON DELETE SET NULL,
    service_type_id UUID REFERENCES service_types(id) ON DELETE SET NULL,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved'
);


-- APPOINTMENTS
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_members(id) ON DELETE SET NULL,
    appointment_time TIMESTAMP NOT NULL,
    location_type TEXT CHECK (location_type IN ('on_site', 'at_home', 'online')) DEFAULT 'on_site',
    address TEXT, -- Opsiyonel olarak kalabilir
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    customer_note TEXT,
    total_price NUMERIC(10, 2)
);


-- PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT now(),
    payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'QR', 'wallet')),
    amount NUMERIC(10, 2),
    payment_status TEXT CHECK (payment_status IN ('successful', 'failed', 'pending')) DEFAULT 'pending'
);

-- REFUNDS
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    refund_amount NUMERIC(10, 2) NOT NULL,
    refund_date TIMESTAMP DEFAULT now(),
    reason TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'rejected')) DEFAULT 'pending'
);

-- PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ORDERS (order_items tablosu için önce bu tablo oluşturulmalı)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2),
    status TEXT CHECK (status IN ('preparing', 'on_the_way', 'delivered', 'cancelled')) DEFAULT 'preparing',
    delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery')) DEFAULT 'delivery',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- SERVICES WORKING DAYS
CREATE TABLE service_working_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME,
    end_time TIME
);

-- FAVORITES
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE
);

-- MEDIA
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT CHECK (entity_type IN ('user', 'business', 'service', 'branch')),
    entity_id UUID,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video', 'document')),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now()
);

-- ADDRESSES
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('home', 'work', 'other')) DEFAULT 'home',
    name TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Turkey',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- SERVICE AREA
CREATE TABLE service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    city TEXT,
    district TEXT,
    radius_km INTEGER
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('system', 'appointment', 'payment', 'promotion')),
    is_read BOOLEAN DEFAULT FALSE,
    entity_id UUID,
    entity_type TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- PROMOTIONS
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
    discount_amount NUMERIC(10, 2),
    code TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- PROMOTION USAGES
CREATE TABLE promotion_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    used_at TIMESTAMP DEFAULT now(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE
);

-- BUSINESS HOURS
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT CHECK (action IN ('create', 'update', 'delete', 'view')),
    user_id UUID,
    changes JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- WALLETS
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'TRY',
    last_transaction_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

-- WALLET TRANSACTIONS
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'refund')),
    reference_id UUID,
    reference_type TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Seed data for roles
INSERT INTO roles (name) VALUES ('admin'), ('customer'), ('business_owner'), ('staff');

-- Seed data for service types
INSERT INTO service_types (name) VALUES ('on_site'), ('home_service'), ('online');

-- Seed data for service categories
INSERT INTO service_categories (name, description, icon_url, is_active) VALUES 
('Berber & Kuaför', 'Saç kesimi, sakal tıraşı ve saç şekillendirme hizmetleri', 'cut-outline', TRUE),
('Güzellik & Bakım', 'Manikür, pedikür, cilt bakımı ve makyaj hizmetleri', 'flower-outline', TRUE),
('Masaj & Spa', 'Masaj, terapi ve spa hizmetleri', 'body-outline', TRUE),
('Temizlik', 'Ev ve ofis temizlik hizmetleri', 'water-outline', TRUE),
('Tamir & Tadilat', 'Genel tamir ve tadilat hizmetleri', 'hammer-outline', TRUE),
('Sağlık', 'Sağlık ve tedavi hizmetleri', 'fitness-outline', TRUE),
('Özel Dersler', 'Akademik, spor ve sanat dersleri', 'school-outline', TRUE),
('Evcil Hayvan', 'Evcil hayvan bakım ve eğitim hizmetleri', 'paw-outline', TRUE),
('Organizasyon', 'Etkinlik planlaması ve organizasyon hizmetleri', 'calendar-outline', TRUE),
('Nakliyat', 'Taşınma ve nakliye hizmetleri', 'car-outline', TRUE);

-- Seed data for business staff roles
INSERT INTO business_staff_roles (name) VALUES ('manager'), ('receptionist'), ('service_provider'); 