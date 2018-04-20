import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import colors from '../colors'
import axios from 'axios'
import image from '../images/Paul.jpg'

const rowHeight = 40

const FormContainer = styled.div`
  box-shadow: ${colors.shadow};
  background: none;
  display: flex;
  flex-direction: column;
  width: 320px;
  min-height: 216px;
  border-radius: 8px;
  user-select: none;
`

const HeaderContainer = styled.div`
  background: ${colors.primary};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  border-radius: 8px 8px 0 0;
  min-height: 160px;
  padding-top: 48px;
`

const Title = styled.h1`
  color: ${colors.white};
  text-align: 'center';
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 3rem;
  margin: 0 0;
  padding: 0;
  user-select: none;
`

const TeamMemberAvatar = styled.img.attrs({
  alt: 'Team Member',
})`
  position: absolute;
  display: block;
  top: -40px;
  z-index: 20;
  object-fit: cover;
  height: 80px;
  width: 80px;
  border-radius: 80px;
  box-shadow: ${colors.shadow};
  user-select: none;
`

const TextAreaContainer = styled.div`
  background: ${colors.white};
  display: flex;
  flex: 1 0 1;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 8px 16px;
  min-height: 56px;
  max-height: 200px;
  border-radius: 0 0 8px 8px;
`

const FeedbackTextArea = styled.textarea.attrs({
  placeholder: 'Type feedback here...',
  autoFocus: true,
})`
  display: block;
  margin: 0 0;
  padding: 8px 0 8px 0;
  width: 248px;
  height: ${rowHeight}px;
  border: none;
  font: inherit;
  resize: none;
  color: ${colors.black};
  overflow: visible;

  &&::placeholder {
    color: ${colors.light_grey};
  }
`

const SendButton = styled.i.attrs({
  children: 'send',
  className: 'material-icons',
})`
  position: relative;
  white-space: pre-wrap;
  color: ${props => props.active ? colors.primary : colors.light_grey};
  user-select: none;
  font-size: 24px;
  cursor: pointer;
  transition: .15s ease;
`

export default class Feedback extends Component {

  state = {
    active: false,
    sending: false,
    sent: false,
    error: false,
    text: '',
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      this.handleSend()
      this.setState({text: ''})
    }
  }

  handleChange = (e) => {
    this.setState({text: e.target.value})
  }

  handleSend = () => {
    const { text } = this.state
    console.log(process.env.REACT_APP_SLACK_WEBHOOK_URL)
    axios.post(process.env.REACT_APP_SLACK_WEBHOOK_URL, JSON.stringify({text: text}))
    .then(res => {
      console.log('success')
    })
    .catch(error => {
      console.log('error type: ', error)
    })
  }

  render() {
    const { text } = this.state
    const canSend = text.length > 0
    return (
      <FormContainer>
        <HeaderContainer>
          <Title>What do you think?</Title>
          <TeamMemberAvatar
            src={image}
          />
        </HeaderContainer>
        <TextAreaContainer>
          <FeedbackTextArea
            value={text}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
          <SendButton
            active={canSend}
            onClick={canSend ? this.handleSend : () => {}}
          />
        </TextAreaContainer>
      </FormContainer>
    )
  }
}
