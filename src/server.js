import express from "express"
import { createHandler } from "graphql-http/lib/use/express"
import { buildSchema } from "graphql"
import { ruruHTML } from "ruru/server"

var schema = buildSchema(`
  type Query {
    hello: String
  }
`)
 
var root = {
  hello() {
    return "Hello world!"
  },
}
 
var app = express()
 
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.listen(3333)
console.log("Running a GraphiQL at http://localhost:3333")