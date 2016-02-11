import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import TextField from 'material-ui/lib/text-field'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import RaisedButton from 'material-ui/lib/raised-button'

injectTapEventPlugin()

const style = {
  padding: "20px 10px",
  maxWidth: "600px",
  margin: "0 auto"
}

const errorStyle = {
  color: 'red'
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

    // Make API call to see dig and whois data of the website
    fetch(`http://${location.host}:666/whois?website=${event.target.value}`)
  	.then(res => res.json())
  	.then( json => {
     self.setState({
        error: json.error,
        result: json.result
      })
    })
  }

  saveRecord() {

  }

  render() {
    const { error, result } = this.state

    return(
      <div>
        <LeftNav open={ true }>
          <MenuItem>Search DNS and WHOIS</MenuItem>
          <MenuItem>Browse stored records</MenuItem>
        </LeftNav>

        <div style={ style }>
          <TextField floatingLabelText="Search website WHOIS information" fullWidth={ true } onEnterKeyDown={ this.query.bind(this) }/>

        	{ error && <div style={ errorStyle }>{ error }</div> }
        	{ result &&  <div> {
            // Split each line break
            result.split('\n').map((row, i) => (
              <span key={ i }>
                {

                  // Split each tab
                  row.split('\t').map((col, coli) => (
                    <span key={ coli } style={{ padding: coli === 0 ? 0 : 10 }}>{ col }</span>
                  ))
                }

                <br/>
              </span>
            ))
          }
          <RaisedButton
            label="Save Record"
            onTouchTap={this.saveRecord}
          />
          </div> }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<WhoISApp />, document.getElementById('app'))
