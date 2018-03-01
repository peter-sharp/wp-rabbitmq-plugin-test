var peter = 'sleepy'

var socket = io.connect()

var $main = document.querySelector('main');

socket.on('posts', function(data){
  var $posts = document.createDocumentFragment()
  data.map(renderPost).forEach($posts.appendChild.bind($posts))

  $main.appendChild($posts)
})

socket.on('post', function(data){
  var $post = document.getElementById('post-'+data.ID)
  if($post) {
    $post.querySelector('.js-title').innerHTML = data.post_title
    $post.querySelector('.js-content').innerHTML = data.post_content
  } else {
    $main.appendChild(renderPost(data))
  }
})

function renderPost(post){
  var $section = document.createElement('section')
  $section.id = `post-${post.ID}`
  $section.className = 'post'
  $section.innerHTML = `  <h2 class="js-title">${post.post_title}</h2>
                          <div class="js-content">${post.post_content}</div>
                          <a href="${post.guid}" target="_blank">view</a>
                        `
  return $section;
}
