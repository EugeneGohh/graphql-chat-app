import './App.css';
import { ApolloProvider } from "@apollo/client";
import { client, Chat } from "./Chat";

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <div className="App">
          <h2>Let's chat!</h2>
          <Chat />
        </div>
      </ApolloProvider>
    </div>
  );
}

export default App;
