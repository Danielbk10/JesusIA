import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { useDevotionals } from '../context/DevotionalsContext';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

export default function SideMenu({ onClose, onSelectChat, onOpenPlans, onViewDevotional }) {
  const { user } = useUser();
  const { devotionals, deleteDevotional } = useDevotionals();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' ou 'devotionals'
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const userPrefix = user?.id ? `user_${user.id}_` : '';
      const chatHistoryKey = `${userPrefix}chat_history`;

      const storedHistory = await AsyncStorage.getItem(chatHistoryKey);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setChatHistory(history);
        console.log('SideMenu: Histórico carregado:', history.length, 'conversas');
      } else {
        setChatHistory([]);
        console.log('SideMenu: Nenhum histórico encontrado');
      }
    } catch (error) {
      console.error('SideMenu: Erro ao carregar histórico:', error);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = searchQuery
    ? chatHistory.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatHistory;

  const filteredDevotionals = searchQuery
    ? devotionals.filter(devotional =>
        devotional.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : devotionals;

  const loadChatFromHistory = async (chatItem) => {
    try {
      console.log('SideMenu: Carregando conversa do histórico:', chatItem.id);
      
      // Carregar as mensagens da conversa específica
      const chatMessages = await AsyncStorage.getItem(`chat_${chatItem.id}`);
      if (chatMessages) {
        const messages = JSON.parse(chatMessages);
        console.log('SideMenu: Mensagens carregadas:', messages.length);
        
        // Passar a conversa completa para o componente pai
        if (onSelectChat) {
          onSelectChat({
            ...chatItem,
            messages: messages
          });
        }
      } else {
        console.warn('SideMenu: Mensagens não encontradas para:', chatItem.id);
        Alert.alert('Aviso', 'Esta conversa não pôde ser carregada.');
      }
    } catch (error) {
      console.error('SideMenu: Erro ao carregar conversa:', error);
      Alert.alert('Erro', 'Não foi possível carregar esta conversa.');
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        loadChatFromHistory(item);
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

  const renderDevotionalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        if (onViewDevotional) {
          onViewDevotional(item);
          onClose();
        }
      }}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatTitle} numberOfLines={1}>
          Devocional {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteDevotional(item.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.chatPreview} numberOfLines={3}>{item.content}</Text>
    </TouchableOpacity>
  );

  const confirmDeleteDevotional = (id) => {
    Alert.alert(
      'Excluir Devocional',
      'Tem certeza que deseja excluir este devocional?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => deleteDevotional(id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/jesus-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>JESUS.IA</Text>
        </View>

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
          placeholder={activeTab === 'chats' ? "Buscar conversas..." : "Buscar devocionais..."}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>Conversas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'devotionals' && styles.activeTab]}
          onPress={() => setActiveTab('devotionals')}
        >
          <Text style={[styles.tabText, activeTab === 'devotionals' && styles.activeTabText]}>Devocionais</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chats' ? (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Conversas</Text>
          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Carregando histórico...</Text>
            </View>
          ) : filteredChats.length > 0 ? (
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
      ) : (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Devocionais Salvos</Text>
          
          {filteredDevotionals.length > 0 ? (
            <FlatList
              data={filteredDevotionals}
              renderItem={renderDevotionalItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'Nenhum devocional encontrado' 
                  : 'Nenhum devocional salvo'}
              </Text>
            </View>
          )}
        </View>
      )}
      
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 8,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
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
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#ff6666',
    fontSize: 12,
    fontWeight: 'bold',
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
