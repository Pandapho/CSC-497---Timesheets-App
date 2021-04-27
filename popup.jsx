import React from 'react'
import "./popup.css"
class Popup extends React.Component {
    state={
        date: "",
        name: "",
    }
    render() {
        const {date , name} = this.state
      return (
        <div className='popup'>
          <div className='popup_inner'>
          <a href="#" onClick={this.props.closePopup} class="close" />
            <h2>Name</h2>
            <input type="text"
                onChange={(e) => this.setState({name : e.target.value})}
            />
            <br/>
            <h2>Date</h2>
            <input
                type="date"
                value={this.state.date}
                onChange={(e) => this.setState({date : e.target.value})}
              />
              <br/>
            <button disabled={this.state.date === "" || this.state.name === ""} class="get" onClick={() => this.props.ok(this.state)}>Get Timesheet</button>
          </div>
        </div>
      );
    }
}

export default Popup