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

  handleClick = () => {
    this.setState(({active}) => ({active: !active}))
  }

  render() {
    const { active } = this.state
    return (
      <Container>
        <Feedback active={active}/>
        <FeedbackButton
          active={active}
          onToggle={this.handleClick}
        />
      </Container>
    );
  }
}

export default App;
