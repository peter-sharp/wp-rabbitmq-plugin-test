const amqp = require('amqplib/callback_api')
const socketIo = require('socket.io')
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

const port = parseInt( process.argv[2] || 8000, 10)

const posts = {}

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url)

  let pathname = `./client${parsedUrl.pathname}`

  const mimeType = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json'
  }

  fs.exists(pathname, function(exist){
    if(!exist){
      res.statusCode = 404
      res.end(`File ${pathname} not found!`)
      return
    }

    if(fs.statSync(pathname).isDirectory()) {
      pathname += 'index.html'
    }

    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      } else {
        const ext = path.parse(pathname).ext
        console.log(pathname,  mimeType[ext])
        res.setHeader('content-type', mimeType[ext] || 'text/plain')
        res.end(data)
      }
    })
  })

})

server.listen(port)

const io = socketIo.listen(server)

console.info(`Server listening on port ${port}`)

var clients = []

io.on('connection', function(socket){
  clients.push(socket)
  console.info('Client connected');
  socket.emit('posts', Object.values(posts));
})


amqp.connect('amqp://localhost', function(err, conn){
  conn.createChannel(function(err, ch) {
    var q = 'post_updates'

    ch.assertQueue(q, {durable: false})

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q)

    ch.consume(q, function(msg) {
      msg = msg.content.toString()
      console.log(" [x] Received %s", msg)
      var post = JSON.parse(msg)

      posts[post.ID] = post;

      clients.forEach(socket => {
        socket.emit('post', post);
      })
    }, {noAck: true})
  })
})
