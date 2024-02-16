import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  gql,
  useQuery,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RestLink } from "apollo-link-rest";

const query = gql`
  query Luke {
    person @rest(type: "Person", path: "people/1/") {
      name
    }
  }
`;

// const uri = "https://swapi.dev/api/";
const uri = "http://does-not-exist-at-all.com/graphql";
const restLink = new RestLink({ uri });

const onErrorLink = onError(({ forward, operation }) => {
  console.log("onErrorLink");
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([onErrorLink, restLink]),
});

const Component = () => {
  const { loading, data, error } = useQuery(query);

  function fetchWithClient() {
    client.query({ query: query }).catch((e) => {
      console.log("button catch ", error);
    });
  }

  useEffect(() => {
    try {
      client
        .query({ query: query })
        .then((data) => {
          console.log("data: ", data);
        })
        .catch((error) => {
          console.log("useEffect catch ", error);
        });
    } catch (error) {
      console.log("call with client useEffect: ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>{error?.message}</Text>
      <Button onPress={fetchWithClient} title="Fetch w/ Client" />
      <StatusBar style="auto" />
    </View>
  );
};

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
