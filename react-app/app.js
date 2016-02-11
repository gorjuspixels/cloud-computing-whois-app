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
  margin: "0 auto",
  position: 'relative'
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
      saved: undefined,
      section: 'search'
    }

    this.changeSection = this.changeSection.bind(this)
  }

  componentDidMount() {
    let self = this

    // Make API call to fetch stored records
    fetch(`http://${location.host}:666/saved`)
  	.then(res => res.json())
  	.then( saved => {
      self.setState({ saved })
    })
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
    let self = this

    // Make API call to save the record
    fetch(`http://${location.host}:666/save?website=${ this.state.website }&result=${ this.state.result }`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then( json => {
      self.setState({
        saved: [...this.state.saved, json]
      })
    })
  }

  changeSection(section) {
    this.setState({ section })
  }

  render() {
    const { error, result, section, saved } = this.state

    return(
      <div>
        <LeftNav open={ true }>
          <MenuItem onTouchTap={ () => this.changeSection('search') }>Search DNS and WHOIS</MenuItem>
          <MenuItem onTouchTap={ () => this.changeSection('browse') }>Browse stored records</MenuItem>
        </LeftNav>

        { section === 'search' &&
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
              style={{
                position: 'absolute',
                top: '50px',
                left: '-150px'
              }}
              secondary={true}
            />
            </div> }
          </div>
        }

        { section === 'browse' && <div style={style}>
          { saved && saved.length === 0 && <span>Nothing is stored. Please save a few records first.</span>}
          { saved && saved.map( record => <div>{ record.website }</div> )}
          </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<WhoISApp />, document.getElementById('app'))
