#!/bin/bash

# Supabase projesindeki veritabanı şemasını yükleme scripti

# Renkli çıktı için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Supabase veritabanı şeması yükleniyor...${NC}"

# Supabase CLI kurulu mu kontrol et
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI bulunamadı. Lütfen önce Supabase CLI'yi yükleyin:${NC}"
    echo -e "npm install -g supabase"
    exit 1
fi

# .env dosyasından Supabase bilgilerini al
if [ -f "../.env" ]; then
    source ../.env
    echo -e "${GREEN}Supabase bilgileri .env dosyasından alındı.${NC}"
else
    echo -e "${RED}.env dosyası bulunamadı. Lütfen Supabase URL ve anahtar bilgilerini manuel olarak girin:${NC}"
    read -p "SUPABASE_URL: " SUPABASE_URL
    read -p "SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
    read -p "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
fi

# Supabase bilgileri doğru girildi mi kontrol et
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}Supabase bilgileri eksik. Lütfen SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY değerlerini kontrol edin.${NC}"
    exit 1
fi

echo -e "${YELLOW}Supabase veri tabanına bağlanılıyor...${NC}"

# PGPASSWORD kullanarak PostgreSQL CLI ile doğrudan bağlanma
HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.gnvvmxergehlkrzsuork
#PGPASSWORD=$SUPABASE_POSTGRES_PASSWORD
PGPASSWORD="hACzdvSGEF9oCtSY"

echo -e "${YELLOW}Şema dosyası yükleniyor...${NC}"
psql --host=$HOST --port=$DB_PORT --username=$DB_USER --dbname=$DB_NAME < schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Veritabanı şeması başarıyla yüklendi!${NC}"
else
    echo -e "${RED}Veritabanı şeması yüklenirken bir hata oluştu.${NC}"
    echo -e "${YELLOW}Alternatif olarak Supabase web arayüzünden SQL Editör kullanarak schema.sql dosyasını manuel olarak çalıştırabilirsiniz.${NC}"
fi

echo -e "${YELLOW}İşlem tamamlandı.${NC}" 