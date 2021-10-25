import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  useSubscription,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Chip, Grid, TextField, Button } from "@material-ui/core";

// To handle subscriptions
const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

// Fetch data from GraphQL server
export const client = new ApolloClient({
  link, //websocket link
  uri: "http://localhost:4000/", //connect to server
  cache: new InMemoryCache(),
});

// Fetch and post data to GraphQL server from React app
const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      text
    }
  }
`;

// Post message query
const POST_MESSAGE = gql`
  mutation ($user: String!, $text: String!) {
    postMessage(user: $user, text: $text)
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) {
    return null; // if no data return null
  }

  // Else return the fetched data
  return (
    <div style={{ marginBottom: "5rem" }}>
      {data.messages.map(({ id, user: messageUser, text }) => {
        return (
          <div
            key={id}
            style={{ textAlign: user === messageUser ? "right" : "left" }}
          >
            <p style={{ marginBottom: "0.3rem" }}>{messageUser}</p>
            <Chip
              style={{ fontSize: "0.9rem" }}
              color={user === messageUser ? "primary" : "secondary"}
              label={text}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Chat = () => {
  const [user, setUser] = useState("Jack"); // initialize user
  const [text, setText] = useState(""); // initialize text

  // 1.
  const [postMessage] = useMutation(POST_MESSAGE);

  const sendMessage = () => {
    // 2.
    if (text.length > 0 && user.length > 0) {
      //calls the mutate function
      postMessage({
        variables: { user: user, text: text },
      });
      setText(""); //reset text field
    } else {
      // 3.
      alert("Missing fields!");
    }
  };

  return (
    <div>
      <Container>
        <h3>Welcome to da chat app! A simple chat app with GraphQL!</h3>
        <Messages user={user} />

        {/*add this block below*/}
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              onChange={(e) => {
                setUser(e.target.value);
              }}
              value={user}
              size="small"
              fullWidth
              variant="outlined"
              required
              label="Enter name here"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
              size="small"
              fullWidth
              variant="outlined"
              required
              label="Enter your message here"
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              onClick={sendMessage}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#60a820", color: "white" }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
