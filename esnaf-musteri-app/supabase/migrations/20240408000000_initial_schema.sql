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

-- ORDERS (Doğru sıralama için ORDERS önce)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2),
    status TEXT CHECK (status IN ('preparing', 'on_the_way', 'delivered', 'cancelled')) DEFAULT 'preparing',
    delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery')) DEFAULT 'delivery',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ORDER ITEMS (ORDERS'dan sonra)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
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

-- RLS Politikalarını Uygulama
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Temel Roller Ekleme
INSERT INTO roles (name) VALUES ('admin'), ('business_owner'), ('customer'), ('staff');

-- Supabase Auth hook ile users tablosuna otomatik kayıt
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email, password_hash)
  VALUES (NEW.id, '', '', NEW.email, '');
  
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT NEW.id, id FROM public.roles WHERE name = 'customer';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 