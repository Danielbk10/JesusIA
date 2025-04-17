import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import { useUser } from '../context/UserContext';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

export default function SideMenu({ onClose, onSelectChat, onOpenPlans }) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Histórico de chats simulado
  const chatHistory = [
    { id: '1', title: 'Como Jesus tratava os estrangeiros?', date: '15/04/2025', preview: 'Jesus tratava os estrangeiros com...' },
    { id: '2', title: 'O que a Bíblia diz sobre perdão?', date: '14/04/2025', preview: 'O perdão é um tema central...' },
    { id: '3', title: 'Quem foram os 12 apóstolos?', date: '13/04/2025', preview: 'Os 12 apóstolos escolhidos por Jesus...' },
    { id: '4', title: 'O que é o fruto do Espírito?', date: '12/04/2025', preview: 'O fruto do Espírito é descrito em...' },
    { id: '5', title: 'Como Jesus via a oração?', date: '11/04/2025', preview: 'Jesus ensinou que a oração deve ser...' },
  ];
  
  // Filtrar chats com base na busca
  const filteredChats = searchQuery
    ? chatHistory.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatHistory;
  
  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => {
        onSelectChat(item);
        onClose();
      }}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.chatDate}>{item.date}</Text>
      </View>
      <Text style={styles.chatPreview} numberOfLines={2}>{item.preview}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JESUS.IA</Text>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversas..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico de Conversas</Text>
        
        {filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Nenhuma conversa encontrada' 
                : 'Nenhuma conversa recente'}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.plansButton}
        onPress={() => {
          onOpenPlans();
          onClose();
        }}
      >
        <Text style={styles.plansButtonText}>Ver Planos de Assinatura</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
    fontFamily: FONTS.SERIF,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  chatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  chatDate: {
    color: '#aaa',
    fontSize: 12,
  },
  chatPreview: {
    color: '#ccc',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  plansButton: {
    backgroundColor: COLORS.PRIMARY,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  plansButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
