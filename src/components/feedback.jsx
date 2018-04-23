import React, { Component } from 'react'
import axios from 'axios'
import { easing, tween, spring } from 'popmotion'
import { withCookies } from 'react-cookie'
import posed, { PoseGroup } from 'react-pose'
import styled from 'styled-components'

import formatMessage from './format-slack-message'
import colors from '../colors'
import image from '../images/Paul.jpg'
import TextareaAutosize from 'react-autosize-textarea'

const customEnterTransition = (props) => tween({
      ...props,
      duration: 150,
      ease: easing.easeIn
  })

const customExitTransition = (props) => tween({
      ...props,
      duration: 150,
      ease: easing.easeOut
  })

const formContainerProps = {
  enter: {
    opacity: 1,
    y: '0%',
    transition: props => customEnterTransition(props),
  },
  exit: {
    opacity: 0,
    y: '10%',
    transition: props => customExitTransition(props),
  }
}
const FormContainer = styled(posed.div(formContainerProps))`
  box-shadow: ${colors.shadow};
  position: fixed;
  bottom: 144px;
  right: 40px;
  z-index: 100;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 320px;
  border-radius: 8px;
  user-select: none;
`

const headerContainerProps = {
  staggerChildren: true,
}
const HeaderContainer = styled(posed.div(headerContainerProps))`
  background: ${colors.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 8px 8px 0 0;
  height: 160px;
  padding: 16px;
  transform-origin: center top;
`

const titleProps = {
  enter: {
    y: '0%',
    opacity: 1,
    transition: props => customEnterTransition(props)
  },
  exit: {
    y: '20%',
    opacity: 0,
    transition: props => customEnterTransition(props)
  }
}
const Title = styled(posed.h1(titleProps))`
  color: ${colors.white};
  text-align: center;
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 2rem;
  margin: 32px 0 0 0;
  padding: 0;
  user-select: none;
`

const teamMemberAvatarProps = {
  initialPose: 'exit',
  enter: {
    scale: 1,
    y: '0%',
    transition: props => spring({
      ...props,
      stiffness: 250,
      dampening: 1000,
    })
  },
  exit: {
    scale: 0,
    y: '100%',
    transition: props => spring({
      ...props,
      stiffness: 250,
      dampening: 1000,
    })
  }
}
const TeamMemberAvatar = styled(posed.img(teamMemberAvatarProps)).attrs({
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

const SubText = styled.div`
  color: ${colors.white};
  text-align: center;
  font-size: .8rem;
  margin: 0 0;
  padding: 0;
  user-select: none;
  cursor: pointer;
`

const namePageProps = {
  enter: {
    x: '0%',
    opacity: 1,
  },
  exit: {
    x: '-100%',
    opacity: 0,
  }
}
const NamePage = styled(posed.div(namePageProps))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`

const feedbackPageProps = {
  enter: {
    x: '0%',
    opacity: 1,
  },
  exit: {
    x: '100%',
    opacity: 0,
  }
}
const FeedbackPage = styled(posed.div(feedbackPageProps))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
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

const FeedbackTextArea = styled(TextareaAutosize).attrs({
  placeholder: props => `Type ${props.retrievecookie ? 'feedback' : 'your name'} here...`,
  autoFocus: true,
})`
  display: block;
  margin: 0 0;
  padding: 8px 0 8px 0;
  width: 248px;
  height: 40px;
  border: none;
  font: inherit;
  resize: none;
  color: ${colors.black};
  overflow: visible;

  &&::placeholder {
    color: ${colors.light_grey};
  }
`

const SubmitButton = styled.i.attrs({
  children: props => props.retrievecookie ? 'send' : 'arrow_forward',
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

class Feedback extends Component {

  state = {
    active: false,
    sending: false,
    sent: false,
    error: false,
    nameSaved: true,
    text: '',
    name: '',
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      this.handleSubmit()
      this.setState({text: ''})
    }
  }

  handleChange = (e) => {
    this.setState({text: e.target.value})
  }

  handleClearCookie = () => {
    const { cookies } = this.props
    cookies.remove('name', {path: '/'})
    this.setState({
      name: '',
      nameSaved: false,
      text: '',
    })
  }

  handleSaveCookie = () => {
    const { cookies } = this.props
    const { text } = this.state
    cookies.set('name', text, {path: '/'} )
    this.setState({
      name: text,
      nameSaved: true,
      text: '',
    })
  }

  handleSubmit = () => {
    const { nameSaved, text, name } = this.state
    if(nameSaved) {
      axios.post(process.env.REACT_APP_SLACK_WEBHOOK_URL, formatMessage(text, name))
      .then(res => {
        console.log('success')
      })
      .catch(error => {
        console.log('error type: ', error)
      })
    } else {
      this.handleSaveCookie()
    }
  }

  componentWillMount() {
    const { cookies } = this.props
    const cookieName = cookies.get('name')
    console.log(cookieName)
    if(cookieName) {
      this.setState({
        name: cookieName,
        nameSaved: true,
      })
    } else {
      this.setState({
        name: '',
        nameSaved: false,
      })
    }
  }

  render() {
    const { nameSaved, text, name } = this.state
    const { active } = this.props
    const canSend = text.length > 0
    return (
      <FormContainer pose={active ? 'enter' : 'exit'}>
        <HeaderContainer>
           <TeamMemberAvatar src={image} />
           <PoseGroup>
             {nameSaved
               ?  <FeedbackPage key={2}>
                    <Title>
                      {`Hey${name ? ' ' + name : ''}, what do you think?`}
                    </Title>
                    <SubText onClick={this.handleClearCookie}>
                      Not {name}?
                    </SubText>
                 </FeedbackPage>
               : <NamePage key={1}>
                   <Title>
                     Can I have you enter your name below?
                   </Title>
                   <SubText>
                     (Your name will be saved for future feedback)
                   </SubText>
                 </NamePage>
             }
           </PoseGroup>
        </HeaderContainer>
        <TextAreaContainer>
          <FeedbackTextArea
            retrievecookie={nameSaved}
            value={text}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
          <SubmitButton
            retrievecookie={nameSaved}
            active={canSend}
            onClick={canSend ? this.handleSubmit : () => {}}
          />
        </TextAreaContainer>
      </FormContainer>
    )
  }
}

export default withCookies(Feedback)
