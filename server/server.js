const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require("graphql");
const app = express();

// CREATING MY OWN ANIME DATASET
const studios = [
    { id: 1, name: "Madhouse" },
    { id: 2, name: "Wit Studio" },
    { id: 3, name: "MAPPA" },
];

const anime = [
    { id: 1, name: "Jujutus Kaisen", authorId: 3 },
    { id: 2, name: "Death Note", authorId: 1 },
    { id: 3, name: "One Punch Man", authorId: 1 },
    { id: 4, name: "Kiseijuu: Sei no Kakuritsu", authorId: 1 },
    { id: 5, name: "Shingeki no Kyojin", authorId: 2 },
    { id: 6, name: "Owari no Seraph", authorId: 2 },
    { id: 7, name: "Mahoutsukai no Yome", authorId: 2 },
    { id: 8, name: "Kakegurui", authorId: 3 },
    { id: 9, name: "Dororo", authorId: 3 },
];

const StudioType = new GraphQLObjectType({
    name: "Studio",
    description: "Studios that create anime",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        anime: {
            type: new GraphQLList(AnimeType),
            resolve: (studio) => {
                return anime.filter((item) => item.authorId === studio.id);
            },
        },
    }),
});

const AnimeType = new GraphQLObjectType({
    name: "Anime",
    description: "This represents an anime made by a studio",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        studio: {
            type: StudioType,
            resolve: (item) => {
                return studios.find((studio) => studio.id === item.id);
            },
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        oneAnime: {
            type: AnimeType,
            description: "Single anime",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (_parent, args) =>
                anime.find((item) => item.authorId === args.id),
        },
        anime: {
            type: new GraphQLList(AnimeType),
            description: "List of anime",
            resolve: () => anime,
        },
        studios: {
            type: new GraphQLList(StudioType),
            description: "List of Studios",
            resolve: () => studios,
        },
        studio: {
            type: StudioType,
            description: "Single studio",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (_parent, args) =>
                studios.find((item) => item.id === args.id),
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addAnime: {
            type: AnimeType,
            description: "Add anime",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (_parent, args) => {
                const newAnime = {
                    id: anime.length + 1,
                    name: args.name,
                    authorId: args.authorId,
                };
                anime.push(newAnime);
                return newAnime;
            },
        },
        addStudio: {
            type: AnimeType,
            description: "Add studio",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (_parent, args) => {
                const newStudio = {
                    id: studios.length + 1,
                    name: args.name,
                };
                studios.push(newStudio);
                return newStudio;
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

app.use(
    "/graphql",
    expressGraphQL({
        schema: schema,
        graphiql: true,
    })
);

app.listen(5000, () => console.log("running!"));
