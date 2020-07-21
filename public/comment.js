window.onload = () => {
  const comment = document.getElementById('comment')

  const sendButton = document.getElementById('send')
  sendButton.addEventListener('click', e => {
    e.preventDefault()

    fetch('/comment', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment.value
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(res => {
      console.log('RES', res)
      if (res.ok) {
        console.log('Comentário enviado com sucesso')
        comment.value = ''
      } else {
        console.log('Ocorreu um erro no envio')
      }
    })
  })
}
