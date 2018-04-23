const formatMessage = (text, name) => {
  return JSON.stringify({
    text: `New feedback from ${name}`,
    attachments: [
      {
        title: 'Feedback Message',
        text: text,
        color: '#06D6A0'
      }
    ]
  })
}

export default formatMessage
