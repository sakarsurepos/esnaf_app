-- Migration: rls_politikalari
-- Created at: Mon Apr  8 18:43:53 EEST 2025

-- RLS Güvenlik Politikaları

-- USERS Tablosu Politikaları
CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Kullanıcılar kendi profillerini düzenleyebilir" ON users
    FOR UPDATE USING (auth.uid() = id);
    
CREATE POLICY "Adminler tüm kullanıcıları görebilir" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Adminler tüm kullanıcıları düzenleyebilir" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- USER_SETTINGS Tablosu Politikaları
CREATE POLICY "Kullanıcılar kendi ayarlarını görebilir" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Kullanıcılar kendi ayarlarını düzenleyebilir" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi ayarlarını ekleyebilir" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- BUSINESSES Tablosu Politikaları
CREATE POLICY "Herkes onaylanmış işletmeleri görebilir" ON businesses
    FOR SELECT USING (is_active = true AND approval_status = 'approved');
    
CREATE POLICY "İşletme sahipleri kendi işletmelerini düzenleyebilir" ON businesses
    FOR UPDATE USING (auth.uid() = owner_id);
    
CREATE POLICY "İşletme sahipleri yeni işletme ekleyebilir" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Adminler tüm işletmeleri yönetebilir" ON businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- BRANCHES Tablosu Politikaları
CREATE POLICY "Herkes aktif şubeleri görebilir" ON branches
    FOR SELECT USING (is_active = true);
    
CREATE POLICY "İşletme sahipleri kendi şubelerini düzenleyebilir" ON branches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = branches.business_id AND b.owner_id = auth.uid()
        )
    );
    
CREATE POLICY "İşletme sahipleri yeni şube ekleyebilir" ON branches
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = business_id AND b.owner_id = auth.uid()
        )
    );

-- STAFF_MEMBERS Tablosu Politikaları
CREATE POLICY "Herkes aktif personelleri görebilir" ON staff_members
    FOR SELECT USING (is_active = true);
    
CREATE POLICY "İşletme sahipleri kendi personellerini yönetebilir" ON staff_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = staff_members.business_id AND b.owner_id = auth.uid()
        )
    );
    
CREATE POLICY "Personel kendi bilgilerini görebilir" ON staff_members
    FOR SELECT USING (user_id = auth.uid());

-- SERVICES Tablosu Politikaları
CREATE POLICY "Herkes aktif servisleri görebilir" ON services
    FOR SELECT USING (is_active = true AND approval_status = 'approved');
    
CREATE POLICY "İşletme sahipleri kendi servislerini yönetebilir" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = services.business_id AND b.owner_id = auth.uid()
        )
    );

-- APPOINTMENTS Tablosu Politikaları
CREATE POLICY "Müşteriler kendi randevularını görebilir" ON appointments
    FOR SELECT USING (customer_id = auth.uid());
    
CREATE POLICY "Müşteriler yeni randevu oluşturabilir" ON appointments
    FOR INSERT WITH CHECK (customer_id = auth.uid());
    
CREATE POLICY "Müşteriler kendi randevularını düzenleyebilir" ON appointments
    FOR UPDATE USING (customer_id = auth.uid());
    
CREATE POLICY "İşletme sahipleri kendi işletmelerindeki randevuları yönetebilir" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = appointments.business_id AND b.owner_id = auth.uid()
        )
    );
    
CREATE POLICY "Personel kendi randevularını görebilir" ON appointments
    FOR SELECT USING (staff_id = auth.uid());

-- PAYMENTS Tablosu Politikaları
CREATE POLICY "Müşteriler kendi ödemelerini görebilir" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = payments.appointment_id AND a.customer_id = auth.uid()
        )
    );
    
CREATE POLICY "İşletme sahipleri kendi işletmelerindeki ödemeleri görebilir" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointments a
            JOIN businesses b ON a.business_id = b.id
            WHERE a.id = payments.appointment_id AND b.owner_id = auth.uid()
        )
    );

-- PRODUCTS Tablosu Politikaları
CREATE POLICY "Herkes aktif ürünleri görebilir" ON products
    FOR SELECT USING (is_active = true);
    
CREATE POLICY "İşletme sahipleri kendi ürünlerini yönetebilir" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = products.business_id AND b.owner_id = auth.uid()
        )
    );

-- ORDERS Tablosu Politikaları
CREATE POLICY "Müşteriler kendi siparişlerini görebilir" ON orders
    FOR SELECT USING (customer_id = auth.uid());
    
CREATE POLICY "Müşteriler yeni sipariş oluşturabilir" ON orders
    FOR INSERT WITH CHECK (customer_id = auth.uid());
    
CREATE POLICY "İşletme sahipleri tüm siparişleri görebilir" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM businesses b
            JOIN products p ON p.business_id = b.id
            JOIN order_items oi ON oi.product_id = p.id
            WHERE oi.order_id = orders.id AND b.owner_id = auth.uid()
        )
    );
