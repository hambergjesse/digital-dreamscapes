import { createApp } from "vue";
import { createStore } from "vuex"; // Use createStore for Vuex 4
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import "./assets/tailwind.css"; // Import Tailwind CSS

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Create the Vue app
const app = createApp(App);

// Provide Apollo Client to the app
app.provide(DefaultApolloClient, apolloClient);

// Add Vuex store
app.use(createStore({}));

// Mount the app
app.mount("#app");
