import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import { Alert } from 'react-native';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);


  async function loadData() {
    const key = '@passmanager:logins';

    try {
      const list = await AsyncStorage.getItem(key);
      const data = list ? JSON.parse(list) : [];
      setSearchListData(data);
      setData(data);
    } catch (error) {
      Alert.alert('Erro ao carregar dados');
    }

  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  function handleFilterLoginData(search: string) {
    const list = data.filter(
      item => item.title.includes(search)
    );

    setSearchListData(list);
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}