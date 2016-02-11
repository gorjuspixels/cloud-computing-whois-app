import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'

injectTapEventPlugin()

import TextField from 'material-ui/lib/text-field'


const style = {
  padding: "20px 10px",
  maxWidth: "600px",
  margin: "0 auto"
}

const errorStyle = {
  color: 'red'
}

const resultStyle = {

}

class WhoISApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      result: undefined,
      error: undefined
    }
  }

  query(event) {
let self = this
    fetch(`http://${location.host}:666?website=${event.target.value}`)
	.then(res => {
	  return res.json()
	})
	.then( json => {
	  self.setState({
            error: json.error,
            result: json.result
          })
        })
  }

  render() {
    const { error, result } = this.state
    
    return(
      <div style={ style }>
        <TextField floatingLabelText="Search website WHOIS information" fullWidth={ true } onEnterKeyDown={ this.query.bind(this) }/>

	{ error && <div style={ errorStyle }>{ error }</div> }
	{ result &&  <div style={ resultStyle }>{ result.split('\n').map((row, i) => <span key={ i }>{ row.split('\t').map((col, coli) => <span key={ coli } style={{ padding: coli === 0 ? 0 : 10 }}>{ col }</span> ) }<br/></span>) }</div> }
      </div>
    )
  }
}

ReactDOM.render(<WhoISApp />, document.getElementById('app'))
