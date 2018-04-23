import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import posed from 'react-pose'
import colors from '../colors'
import { easing, tween } from 'popmotion'

const themes = {
  default: {
    bg: colors.primary,
    border: colors.primary,
    fg: colors.white,
  },
  defaultHover: {
    bg: colors.white,
    border: colors.primary,
    fg: colors.primary,
  },
  active: {
    bg: colors.black,
    border: colors.black,
    fg: colors.white,
  },
  activeHover: {
    bg: colors.white,
    border: colors.black,
    fg: colors.black,
  }
}

const customTransition = (props) => tween({
      ...props,
      duration: 50,
      ease: easing.easeInOut
  })

const ButtonContainer = styled.div`
  color: ${props => props.theme.fg};
  background: ${props => props.theme.bg};
  border: 4px solid ${props => props.theme.border};
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 80px;
  border-radius: 80px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: ${colors.shadow};
  transition: .15s;
`

const IconContainer = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
`

const sendIconProps = {
  inactive: { scale: 1, rotate: '0deg', opacity: 1, transition: props => customTransition(props), },
  active: { scale: 0, rotate: '45deg', opacity: 0 , transition: props => customTransition(props), }
}
const SendIcon = styled(posed.i(sendIconProps)).attrs({
  children: 'send',
  className: 'material-icons',
})`
  color: ${props => props.theme.fg};
  position: absolute;
  user-select: none;
  font-size: 40px;
  transition: .15s ease;
`

const closeIconProps = {
  initialPose: 'inactive',
  active: { scale: 1, rotate: '0deg', opacity: 1, transition: props => customTransition(props), },
  inactive: { scale: 0, rotate: '-45deg', opacity: 0 , transition: props => customTransition(props), }
}
const CloseIcon = styled(posed.i(closeIconProps)).attrs({
  children: 'close',
  className: 'material-icons',
})`
  color: ${props => props.theme.fg};
  position: absolute;
  opacity: 0;
  user-select: none;
  font-size: 40px;
  transition: .15s ease;
`

export default class FeedbackButton extends Component {

  state = {
    hover: false,
  }

  getTheme = () => {
    const { active } = this.props
    const { hover } = this.state
    switch(true) {
      case (active && !hover):
        return themes.active
      case (active && hover):
        return themes.activeHover
      case (!active && !hover):
        return themes.default
      case (!active && hover):
        return themes.defaultHover
      default:
        return themes.default
    }
  }

  render() {
    const { active } = this.props
    return(
      <ThemeProvider theme={this.getTheme()}>
        <ButtonContainer
            onClick={() => this.props.onToggle()}
            onMouseEnter={() => this.setState({hover: true})}
            onMouseLeave={() => this.setState({hover: false})}
          >
            <IconContainer>
              <CloseIcon pose={active ? 'active' : 'inactive'}/>
              <SendIcon pose={active ? 'active' : 'inactive'}/>
            </IconContainer>
          </ButtonContainer>
      </ThemeProvider>
    )
  }
}
