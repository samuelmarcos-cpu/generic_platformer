window.onload = () => {
  const title = document.getElementById('title')
  const comment = document.getElementById('comment')

  const sendButton = document.getElementById('send')
  sendButton.addEventListener('click', e => {
    e.preventDefault()

    fetch('/comment', {
      method: 'POST',
      body: JSON.stringify({
        title: title.value,
        comment: comment.value
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(res => {
      res
        .then(data => {
          console.log('DATA', data)
        })
        .catch(e => {
          console.log('Esperando conexão...')
        })
    })
  })
}
