import React, { Component } from 'react'
import styled from 'styled-components'
import Feedback from './components/feedback'
import FeedbackButton from './components/feedback-button'

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`

class App extends Component {

  state = {
    active: false,
  }

  handleClose = () => {
    this.setState(({active}) => ({active: !active}))
  }

  render() {
    const { active } = this.state
    return (
      <Container>
        <Feedback
          small
          active={active}
          handleClose={this.handleClose}
        />
        <FeedbackButton
          small
          active={active}
          onToggle={this.handleClose}
        />
      </Container>
    );
  }
}

export default App;
