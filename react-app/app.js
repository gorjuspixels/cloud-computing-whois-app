import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import TextField from 'material-ui/lib/text-field'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

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
      error: undefined,
      tab: 'search'
    }

    this.handleChange = this.handleChange.bind(this)
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

  handleChange(value) {
    this.setState({
      tab: value,
    })
  }

  render() {
    const { error, result, tab } = this.state

    return(
      <Tabs
        value={tab}
        onChange={this.handleChange}
      >
        <Tab label="Search" value="search" >
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
            </div> }
          </div>
        </Tab>
        <Tab label="Browse" value="browse">
          <div>

          </div>
        </Tab>
      </Tabs>
    )
  }
}

ReactDOM.render(<WhoISApp />, document.getElementById('app'))
