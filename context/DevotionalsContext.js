import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DevotionalsContext = createContext();

export const DevotionalsProvider = ({ children }) => {
  const [devotionals, setDevotionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar devocionais salvos
  useEffect(() => {
    loadDevotionals();
  }, []);

  const loadDevotionals = async () => {
    try {
      setLoading(true);
      const storedDevotionals = await AsyncStorage.getItem('devotionals');
      
      if (storedDevotionals) {
        setDevotionals(JSON.parse(storedDevotionals));
      }
    } catch (error) {
      console.error('Erro ao carregar devocionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDevotional = async (content) => {
    try {
      // Criar um novo devocional
      const newDevotional = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
      };
      
      // Adicionar ao array de devocionais
      const updatedDevotionals = [newDevotional, ...devotionals];
      setDevotionals(updatedDevotionals);
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('devotionals', JSON.stringify(updatedDevotionals));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar devocional:', error);
      return false;
    }
  };

  const deleteDevotional = async (id) => {
    try {
      // Filtrar o devocional a ser removido
      const updatedDevotionals = devotionals.filter(
        (devotional) => devotional.id !== id
      );
      
      // Atualizar o estado
      setDevotionals(updatedDevotionals);
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('devotionals', JSON.stringify(updatedDevotionals));
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir devocional:', error);
      return false;
    }
  };

  return (
    <DevotionalsContext.Provider
      value={{
        devotionals,
        loading,
        saveDevotional,
        deleteDevotional,
        loadDevotionals,
      }}
    >
      {children}
    </DevotionalsContext.Provider>
  );
};

export const useDevotionals = () => useContext(DevotionalsContext);
