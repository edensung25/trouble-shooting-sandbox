import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://does-not-exist-at-all.com/graphql"
  }),
});

const Component = () => {
  const { loading, data, error } = useQuery(ALL_PEOPLE);

  function fetchWithClient() {
    client.query({ query: ALL_PEOPLE });
  };
  
  useEffect(() => {
    client.query({ query: ALL_PEOPLE });
  }, []);

  return (
  <View style={styles.container}>
    <Text>{error?.message}</Text>
    <Button onPress={fetchWithClient} title="Fetch w/ Client" />
    <StatusBar style="auto" />
  </View>
  );
}

export default function App() {
  return (
  <ApolloProvider client={client}>
    <Component />
  </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
