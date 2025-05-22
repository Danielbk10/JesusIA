import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  ImageBackground, 
  Alert, 
  ScrollView, 
  Image,
  Pressable
} from 'react-native';
import { SendIcon } from './Icon';
import AudioButton from './AudioButton';
import ShareCard from './ShareCard';
import SpeechToggleButton from './SpeechToggleButton';
import { useCredits } from '../context/CreditsContext';
import { useUser } from '../context/UserContext';
import { useDevotionals } from '../context/DevotionalsContext';
import { useSpeech } from '../context/SpeechContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatResponse } from '../services/apiService';
import { FONTS } from '../config/fontConfig';
import { COLORS } from '../config/colorConfig';

export default function ChatScreen({ currentChat }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showShareCard, setShowShareCard] = useState(false);
  const { useCredit, credits, plan } = useCredits();
  const { user } = useUser();
  const { saveDevotional } = useDevotionals();
  const { speak, isSpeechEnabled } = useSpeech();
  const flatListRef = useRef(null);

  // Carregar mensagens do armazenamento local ou do chat selecionado
  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (currentChat) {
          // Se um chat foi selecionado do histórico, carregamos suas mensagens
          const chatId = currentChat.id;
          const storedMessages = await AsyncStorage.getItem(`chat_${chatId}`);
          
          if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
          } else {
            // Se não houver mensagens salvas para este chat, criamos com base no título
            setMessages([
              {
                id: '1',
                text: 'Olá! Eu sou Jesus.IA, um assistente baseado na Bíblia. Como posso ajudar você hoje?',
                sender: 'ai',
                timestamp: new Date(),
              },
              {
                id: '2',
                text: currentChat.title,
                sender: 'user',
                timestamp: new Date(),
              },
              {
                id: '3',
                text: currentChat.preview,
                sender: 'ai',
                timestamp: new Date(),
              },
            ]);
          }
        } else {
          // Se nenhum chat foi selecionado, verificamos se há um chat atual salvo
          const currentChatId = await AsyncStorage.getItem('current_chat_id');
          
          if (currentChatId) {
            const storedMessages = await AsyncStorage.getItem(`chat_${currentChatId}`);
            if (storedMessages) {
              setMessages(JSON.parse(storedMessages));
              return;
            }
          }
          
          // Se não houver chat atual, mostramos a mensagem inicial
          setMessages([
            {
              id: '1',
              text: 'Olá! Eu sou Jesus.IA, um assistente baseado na Bíblia. Como posso ajudar você hoje?',
              sender: 'ai',
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        // Em caso de erro, exibimos pelo menos a mensagem inicial
        setMessages([
          {
            id: '1',
            text: 'Olá! Eu sou Jesus.IA, um assistente baseado na Bíblia. Como posso ajudar você hoje?',
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
      }
    };
    
    loadMessages();
  }, [currentChat]);

  // Rolar para o final da lista quando novas mensagens são adicionadas
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async (text = message) => {
    if (!text.trim()) return;

    // Verificar se há créditos disponíveis (apenas para planos gratuitos)
    if (credits <= 0 && plan === 'free') {
      Alert.alert(
        'Créditos Insuficientes',
        'Você não tem créditos suficientes. Assista a um anúncio para ganhar mais créditos ou faça upgrade para um plano premium.'
      );
      return;
    }

    // Consumir um crédito (não consome para planos premium)
    const hasCredit = await useCredit();
    if (!hasCredit) {
      Alert.alert(
        'Créditos Insuficientes',
        'Você não tem créditos suficientes. Assista a um anúncio para ganhar mais créditos ou faça upgrade para um plano premium.'
      );
      return;
    }

    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setLoading(true);

    try {
      // Simular uma chamada de API para obter resposta do modelo
      const response = await getAIResponse(text);

      // Adicionar resposta do AI
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Narrar a resposta se a narração estiver ativada
      if (isSpeechEnabled) {
        speak(response);
      }
      
      // Salvar a conversa no armazenamento local
      const chatId = currentChat ? currentChat.id : 'current_chat';
      await AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(finalMessages));
      await AsyncStorage.setItem('current_chat_id', chatId);
      
      // Se for uma nova conversa, salvar no histórico
      if (!currentChat && finalMessages.length === 3) {
        // É uma nova conversa com apenas a mensagem inicial, a pergunta do usuário e a resposta
        const newChatId = `chat_${Date.now()}`;
        const newChat = {
          id: newChatId,
          title: text.length > 30 ? text.substring(0, 30) + '...' : text,
          date: new Date().toLocaleDateString(),
          preview: response.length > 50 ? response.substring(0, 50) + '...' : response,
        };
        
        // Salvar o novo chat no histórico
        const storedHistory = await AsyncStorage.getItem('chat_history');
        const chatHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedHistory = [newChat, ...chatHistory].slice(0, 20); // Manter apenas os 20 chats mais recentes
        
        await AsyncStorage.setItem('chat_history', JSON.stringify(updatedHistory));
        await AsyncStorage.setItem(`chat_${newChatId}`, JSON.stringify(finalMessages));
        await AsyncStorage.setItem('current_chat_id', newChatId);
      }
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      Alert.alert('Erro', 'Não foi possível obter uma resposta. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (text) => {
    try {
      // Tentar obter resposta da API do ChatGPT
      const result = await getChatResponse(text);
      
      if (result.success) {
        // Se a chamada foi bem-sucedida, retornar a resposta da API
        return result.response;
      } else {
        console.log('Erro na API ChatGPT, usando simulação como fallback:', result.error);
        
        // Se houve erro na API, usar respostas simuladas como fallback
        // Respostas simuladas baseadas em perguntas comuns
        const responses = {
          'oi': 'Olá! Como posso ajudar você hoje com base nos ensinamentos de Jesus?',
          'olá': 'Olá! Como posso ajudar você hoje com base nos ensinamentos de Jesus?',
          'quem é jesus': 'Jesus Cristo é o filho de Deus, nascido de Maria, que veio ao mundo para salvar a humanidade. Ele ensinou sobre amor, perdão e compaixão, realizou milagres, morreu na cruz pelos nossos pecados e ressuscitou ao terceiro dia, conforme as Escrituras.',
          'o que é a bíblia': 'A Bíblia é o livro sagrado do cristianismo, composto por 66 livros divididos em Antigo e Novo Testamento. É considerada a Palavra de Deus, contendo ensinamentos, histórias, profecias e orientações para a vida cristã.',
          'como ser salvo': 'De acordo com a Bíblia, a salvação vem pela fé em Jesus Cristo. Em João 3:16, lemos: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." A salvação é um presente de Deus, recebido pela fé, não por obras (Efésios 2:8-9).',
          'o que jesus ensinou': 'Jesus ensinou muitos princípios fundamentais, incluindo amar a Deus sobre todas as coisas e ao próximo como a si mesmo (Mateus 22:37-39), perdoar os outros (Mateus 6:14-15), não julgar (Mateus 7:1-5), ser humilde (Mateus 5:5), buscar primeiro o Reino de Deus (Mateus 6:33), entre outros ensinamentos encontrados principalmente nos Evangelhos.',
        };

        // Verificar se há uma resposta específica para a pergunta
        const lowercaseText = text.toLowerCase();
        for (const [key, value] of Object.entries(responses)) {
          if (lowercaseText.includes(key)) {
            return value;
          }
        }

        // Resposta padrão
        return 'Com base nos ensinamentos de Jesus, posso dizer que o amor e a compaixão são fundamentais em nossa jornada espiritual. Jesus nos ensinou a amar a Deus sobre todas as coisas e ao próximo como a nós mesmos. Se você tiver uma pergunta mais específica sobre os ensinamentos bíblicos, ficarei feliz em ajudar.';
      }
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      return 'Desculpe, estou enfrentando dificuldades para processar sua pergunta. Por favor, tente novamente mais tarde ou reformule sua pergunta.';
    }
  };

  const handleAudioMessage = (transcription) => {
    sendMessage(transcription);
  };
  
  const handleTextSelection = (text) => {
    if (text.trim().length > 0) {
      setSelectedText(text);
      setShowShareCard(true);
    }
  };
  
  const handleSaveDevotional = async () => {
    const success = await saveDevotional(selectedText);
    if (success) {
      Alert.alert('Sucesso', 'Devocional salvo com sucesso!');
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o devocional.');
    }
    setShowShareCard(false);
  };

  const renderMessage = ({ item }) => {
    const isAI = item.sender === 'ai';
    return (
      <View
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isAI ? styles.aiMessageBubble : styles.userMessageBubble,
          ]}
        >
          {isAI ? (
            <Pressable
              onLongPress={() => handleTextSelection(item.text)}
              delayLongPress={500}
            >
              <Text style={styles.messageText} selectable={true}>{item.text}</Text>
              <Text style={styles.selectionHint}>Pressione e segure para compartilhar</Text>
            </Pressable>
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )}
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/tree_background.png')}
      style={styles.container}
      imageStyle={styles.backgroundImageStyle}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#00a884" />
          <Text style={styles.loadingText}>Jesus está digitando...</Text>
        </View>
      )}

      <View style={styles.speechToggleContainer}>
        <SpeechToggleButton />
      </View>

      <View style={styles.inputContainer}>
        
        <View style={styles.bottomInputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {message.trim() ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendMessage()}
            >
              <SendIcon size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <AudioButton onSendAudio={handleAudioMessage} />
          )}
        </View>
      </View>
      
      {showShareCard && (
        <ShareCard 
          content={selectedText} 
          onSave={handleSaveDevotional}
          onClose={() => setShowShareCard(false)}
        />
      )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backgroundImageStyle: {
    opacity: 0.1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  aiMessageBubble: {
    backgroundColor: '#262626',
  },
  userMessageBubble: {
    backgroundColor: COLORS.PRIMARY,
  },
  messageText: {
    color: '#fff',
    fontFamily: FONTS.SERIF,
    fontSize: 16,
  },
  selectionHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 4,
    fontStyle: 'italic',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  loadingText: {
    color: COLORS.TEXT_MUTED,
    marginLeft: 8,
  },
  speechToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'column',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: `rgba(184, 157, 76, 0.8)`,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(184, 157, 76, 0.8)`,
  },
  topInputRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  bottomInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
    fontFamily: FONTS.SERIF,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});
