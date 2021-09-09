const { GraphQLServer, PubSub } = require("graphql-yoga");

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    text: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, text: String!): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`;

const messages = []; // Store messages here
const subscribers = []; // Store new messages sent upon listening

const onMessagesUpdates = (fn) => subscribers.push(fn);

// Create a resolver to retrieve data

const resolvers = {
  // Resolver functions below
  Query: {
    messages: messages,
  },
  Mutation: {
    postMessage: (parent, { user, text }) => {
      const id = messages.length; // Create id for each new message
      messages.push({ id, user, text }); // Push to messages array
      subscribers.forEach((fn) => fn());
      return id; // Return id
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        // Create random number as the channel to publish messages

        const channel = Math.random().toString(36).slice(2, 15);

        // Publish user to the subscriber array
        // Then publish updated messages array to the channel as the callback
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));

        // Publish all messages immediately once user subscribed to it
        setTimeout(() => pubsub.publish(channel, { messages }), 0);

        // Return asyncIterator
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

// New instance
const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
