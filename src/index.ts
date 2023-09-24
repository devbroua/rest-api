import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import mongoose, { Error } from "mongoose"
import router from "./router"

const app = express()

app.use(
  cors({
    credentials: true,
  })
)

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(8888, () => {
  console.log("server is running on port 8888")
})

const MONGODB_URL =
  "mongodb+srv://restbackend:0000@cluster0.mr5070m.mongodb.net/?retryWrites=true&w=majority"

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL)
mongoose.connection.on("error", (err: Error) => console.log(err))

app.use("/", router())
