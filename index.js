var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

var schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  }

  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }

  type Dish {
    name: String
    price: Int
  }

  input DishInput {
    name: String
    price: Int
  }

  input RestaurantInput {
    name: String
    description: String
    dishes: [DishInput]
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type Mutation {
    setrestaurant(input: RestaurantInput): Restaurant
    deleterestaurant(id: Int!): DeleteResponse
    editrestaurant(id: Int!, name: String!): Restaurant
  }
`);

var root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    const newRestaurant = {
      id: restaurants.length + 1, 
      name: input.name,
      description: input.description,
      dishes: input.dishes.map(dish => ({
        name: dish.name,
        price: dish.price
      }))
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    const ok = Boolean(restaurants.find(restaurant => restaurant.id === id));
    restaurants = restaurants.filter(restaurant => restaurant.id !== id);
    return { ok };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }
    restaurants[index] = {
      ...restaurants[index],
      ...restaurant
    };
    return restaurants[index];
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

var port = 5500;
app.listen(port, () => console.log(`Running GraphQL on Port: ${port}`));

module.exports = root;
