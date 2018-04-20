import React, { Component } from 'react'
import styled from 'styled-components'
import logo from './slack.svg'
import Feedback from './components/feedback'

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`

class App extends Component {
  render() {
    return (
      <Container>
        <Feedback />
      </Container>
    );
  }
}

export default App;
