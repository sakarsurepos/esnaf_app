#!/bin/bash

# Migrasyon adını komut satırından al
if [ -z "$1" ]; then
    echo "Kullanım: $0 <migrasyon_adi>"
    exit 1
fi

MIGRATION_NAME=$1
TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIGRATION_FILE="supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql"

# Migrasyon klasörünün varlığını kontrol et
if [ ! -d "supabase/migrations" ]; then
    mkdir -p supabase/migrations
    echo "migrations klasörü oluşturuldu"
fi

# Migrasyon dosyasını oluştur
touch "$MIGRATION_FILE"
echo "-- Migration: $MIGRATION_NAME" > "$MIGRATION_FILE"
echo "-- Created at: $(date)" >> "$MIGRATION_FILE"
echo "" >> "$MIGRATION_FILE"
echo "-- Buraya migrasyon SQL kodunu ekleyin" >> "$MIGRATION_FILE"

echo "Migrasyon dosyası oluşturuldu: $MIGRATION_FILE"
echo "Şimdi dosyanızı bir metin editörü ile düzenleyebilirsiniz." 