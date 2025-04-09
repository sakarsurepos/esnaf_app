import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { Tables } from '../../types/supabase';
import { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress } from '../../services/dataService';

type AddressManagementScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'AddressManagement'>;

type Address = Tables<'addresses'>;

interface AddressFormData {
  id?: string;
  title: string;
  address: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

const AddressManagementScreen = () => {
  const navigation = useNavigation<AddressManagementScreenNavigationProp>();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    title: '',
    address: '',
    city: '',
    postal_code: '',
    is_default: false
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const { data, error } = await getUserAddresses(user.id);
      
      if (error) {
        throw new Error('Adresler yüklenirken bir hata oluştu');
      }
      
      setAddresses(data || []);
      
    } catch (error) {
      console.error('Adresler yüklenirken hata:', error);
      Alert.alert('Hata', 'Adresler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setFormData({
      title: '',
      address: '',
      city: '',
      postal_code: '',
      is_default: false
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      id: address.id,
      title: address.title,
      address: address.address,
      city: address.city,
      postal_code: address.postal_code,
      is_default: address.is_default || false
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Adresi Sil',
      'Bu adresi silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteAddress(addressId),
        },
      ]
    );
  };

  const deleteAddress = async (addressId: string) => {
    try {
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const { error } = await deleteUserAddress(user.id, addressId);
      
      if (error) {
        throw new Error('Adres silinirken bir hata oluştu');
      }
      
      // UI'ı güncelle
      setAddresses(addresses.filter(a => a.id !== addressId));
      
      Alert.alert('Başarılı', 'Adres başarıyla silindi.');
      
    } catch (error) {
      console.error('Adres silme hatası:', error);
      Alert.alert('Hata', 'Adres silinirken bir sorun oluştu.');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      // Önce tüm adreslerin default durumunu false yapalım (UI)
      const updatedAddresses = addresses.map(address => ({
        ...address,
        is_default: address.id === addressId
      }));
      
      setAddresses(updatedAddresses);
      
      // Seçilen adresi default olarak ayarla
      await updateUserAddress(user.id, addressId, { is_default: true });
      
      // Diğer adreslerin default durumunu kaldır
      const otherAddresses = addresses.filter(a => a.id !== addressId);
      for (const address of otherAddresses) {
        if (address.is_default) {
          await updateUserAddress(user.id, address.id, { is_default: false });
        }
      }
      
      Alert.alert('Bilgi', 'Varsayılan adres güncellendi.');
      
    } catch (error) {
      console.error('Varsayılan adres güncelleme hatası:', error);
      Alert.alert('Hata', 'Varsayılan adres güncellenirken bir sorun oluştu.');
      loadAddresses(); // Hata durumunda orijinal verileri tekrar yükle
    }
  };

  const handleChange = (field: keyof AddressFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Hata', 'Lütfen adres başlığını girin.');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Hata', 'Lütfen adresi girin.');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Hata', 'Lütfen şehri girin.');
      return false;
    }
    if (!formData.postal_code.trim()) {
      Alert.alert('Hata', 'Lütfen posta kodunu girin.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSavingAddress(true);
      
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      let result;
      
      if (isEditing && formData.id) {
        // Güncelleme
        result = await updateUserAddress(user.id, formData.id, {
          title: formData.title,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          is_default: formData.is_default
        });
        
        if (result.error) {
          throw new Error('Adres güncellenirken bir hata oluştu');
        }
        
        // UI'ı güncelle
        setAddresses(addresses.map(a => a.id === formData.id ? { ...a, ...formData } : a));
        
        // Eğer bu adres varsayılan yapıldıysa diğer adresleri güncelle
        if (formData.is_default) {
          handleSetDefault(formData.id);
        }
        
        Alert.alert('Başarılı', 'Adres başarıyla güncellendi.');
      } else {
        // Yeni adres ekleme
        const addressData = {
          title: formData.title,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          is_default: formData.is_default
        };
        
        result = await addUserAddress(user.id, addressData);
        
        if (result.error) {
          throw new Error('Adres eklenirken bir hata oluştu');
        }
        
        // UI'ı güncelle
        if (result.data) {
          setAddresses([...addresses, result.data]);
          
          // Eğer bu adres varsayılan yapıldıysa diğer adresleri güncelle
          if (formData.is_default && result.data.id) {
            handleSetDefault(result.data.id);
          }
        }
        
        Alert.alert('Başarılı', 'Adres başarıyla eklendi.');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Adres kaydetme hatası:', error);
      Alert.alert('Hata', 'Adres kaydedilirken bir sorun oluştu.');
    } finally {
      setSavingAddress(false);
    }
  };

  const renderAddressForm = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              disabled={savingAddress}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.inputLabel}>Adres Başlığı</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Ev, İş, Yazlık"
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              editable={!savingAddress}
            />

            <Text style={styles.inputLabel}>Adres</Text>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              placeholder="Adres bilgisi"
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              multiline
              editable={!savingAddress}
            />

            <Text style={styles.inputLabel}>Şehir</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Şehir"
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              editable={!savingAddress}
            />

            <Text style={styles.inputLabel}>Posta Kodu</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Posta kodu"
              value={formData.postal_code}
              onChangeText={(text) => handleChange('postal_code', text)}
              keyboardType="number-pad"
              editable={!savingAddress}
            />

            <TouchableOpacity
              style={styles.defaultCheckbox}
              onPress={() => handleChange('is_default', !formData.is_default)}
              disabled={savingAddress}
            >
              <View style={[
                styles.checkbox,
                formData.is_default && styles.checkboxChecked
              ]}>
                {formData.is_default && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Varsayılan adres olarak ayarla</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
              disabled={savingAddress}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, savingAddress && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={savingAddress}
            >
              {savingAddress ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Adresler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.addressesContainer}>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressItem}>
              <View style={styles.addressHeader}>
                <View style={styles.addressTitleContainer}>
                  <Text style={styles.addressTitle}>{address.title}</Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                    </View>
                  )}
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Ionicons name="create-outline" size={18} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.addressText}>{address.address}</Text>
              <Text style={styles.cityText}>{address.city}, {address.postal_code}</Text>

              {!address.is_default && (
                <TouchableOpacity
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefault(address.id)}
                >
                  <Text style={styles.setDefaultText}>Varsayılan Yap</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Henüz adres eklenmemiş</Text>
            <Text style={styles.emptySubtext}>Adreslerinizi ekleyerek alışverişlerinizde kolayca kullanabilirsiniz.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddAddress}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Yeni Adres Ekle</Text>
      </TouchableOpacity>

      {renderAddressForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  addressList: {
    flex: 1,
    padding: 16,
  },
  addressItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#3498db',
  },
  addressActions: {
    flexDirection: 'row',
  },
  addressAction: {
    marginLeft: 12,
    padding: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  setDefaultButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  setDefaultButtonText: {
    color: '#3498db',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 80,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressManagementScreen; 