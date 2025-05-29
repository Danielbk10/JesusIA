import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Verifica se um novo chat deve ser iniciado com base na data do último acesso
 * ou se o usuário fechou a sessão
 * @param {string} userId - ID do usuário atual (opcional)
 */
export const shouldStartNewChat = async (userId = null) => {
  try {
    // Criar chave de acesso específica para o usuário
    const userPrefix = userId ? `user_${userId}_` : '';
    const lastAccessKey = `${userPrefix}last_access_date`;
    const sessionClosedKey = `${userPrefix}session_closed`;
    
    // Verificar a data do último acesso
    const lastAccessDate = await AsyncStorage.getItem(lastAccessKey);
    const currentDate = new Date().toDateString();
    
    // Se não houver data de último acesso, ou se for um dia diferente, iniciar novo chat
    if (!lastAccessDate || lastAccessDate !== currentDate) {
      console.log(`Iniciando novo chat para usuário ${userId || 'anônimo'}: novo dia ou primeiro acesso`);
      // Atualizar a data de último acesso
      await AsyncStorage.setItem(lastAccessKey, currentDate);
      return true;
    }
    
    // Verificar se o usuário fechou a sessão
    const sessionClosed = await AsyncStorage.getItem(sessionClosedKey);
    if (sessionClosed === 'true') {
      console.log(`Iniciando novo chat para usuário ${userId || 'anônimo'}: sessão anterior foi fechada`);
      // Resetar o flag de sessão fechada
      await AsyncStorage.setItem(sessionClosedKey, 'false');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao verificar sessão de chat:', error);
    return false;
  }
};

/**
 * Marca a sessão atual como fechada
 * @param {string} userId - ID do usuário atual (opcional)
 */
export const closeSession = async (userId = null) => {
  try {
    // Criar chave de acesso específica para o usuário
    const userPrefix = userId ? `user_${userId}_` : '';
    const sessionClosedKey = `${userPrefix}session_closed`;
    const chatHistoryKey = `${userPrefix}chat_history`;
    
    await AsyncStorage.setItem(sessionClosedKey, 'true');
    console.log(`Sessão marcada como fechada para usuário ${userId || 'anônimo'}`);
    
    // Salvar o chat atual no histórico se houver mensagens
    const currentChatId = await AsyncStorage.getItem('current_chat_id');
    if (currentChatId) {
      const storedMessages = await AsyncStorage.getItem(`chat_${currentChatId}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        
        // Só salvar no histórico se houver mais de uma mensagem (mais que só a mensagem inicial)
        if (messages.length > 1) {
          // Encontrar a primeira mensagem do usuário para usar como título
          const userMessage = messages.find(msg => msg.sender === 'user');
          // Encontrar a primeira resposta da IA após a mensagem do usuário
          const aiResponse = messages.find(msg => 
            msg.sender === 'ai' && 
            new Date(msg.timestamp) > new Date(userMessage?.timestamp || 0)
          );
          
          if (userMessage) {
            const timestamp = Date.now();
            const newChatId = `${userPrefix}chat_${timestamp}`;
            const newChat = {
              id: newChatId,
              title: userMessage.text.length > 30 ? 
                userMessage.text.substring(0, 30) + '...' : 
                userMessage.text,
              date: new Date().toLocaleDateString(),
              preview: aiResponse ? 
                (aiResponse.text.length > 50 ? 
                  aiResponse.text.substring(0, 50) + '...' : 
                  aiResponse.text) : 
                'Conversa com Jesus.IA',
              userId: userId // Adicionar o ID do usuário para filtrar histórico por usuário
            };
            
            // Salvar o chat no histórico
            const storedHistory = await AsyncStorage.getItem(chatHistoryKey);
            const chatHistory = storedHistory ? JSON.parse(storedHistory) : [];
            const updatedHistory = [newChat, ...chatHistory].slice(0, 20); // Manter apenas os 20 chats mais recentes
            
            await AsyncStorage.setItem(chatHistoryKey, JSON.stringify(updatedHistory));
            await AsyncStorage.setItem(`chat_${newChatId}`, JSON.stringify(messages));
            console.log(`Chat atual salvo no histórico para usuário ${userId || 'anônimo'}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao fechar sessão:', error);
  }
};

/**
 * Inicia um novo chat, limpando o chat atual
 */
export const startNewChat = async (userId = null) => {
  try {
    // Mensagem inicial padrão
    const initialMessage = {
      id: Date.now().toString(),
      text: 'Olá! Eu sou Jesus.IA, um assistente baseado na Bíblia. Como posso ajudar você hoje?',
      sender: 'ai',
      timestamp: new Date(),
    };
    
    // Criar um novo ID para o chat com prefixo do usuário se disponível
    const userPrefix = userId ? `user_${userId}_` : '';
    const newChatId = `${userPrefix}current_chat`;
    
    // Salvar o novo chat como atual
    await AsyncStorage.setItem(`chat_${newChatId}`, JSON.stringify([initialMessage]));
    await AsyncStorage.setItem('current_chat_id', newChatId);
    
    console.log('Novo chat iniciado para usuário:', userId || 'anônimo');
    return initialMessage;
  } catch (error) {
    console.error('Erro ao iniciar novo chat:', error);
    return null;
  }
};
