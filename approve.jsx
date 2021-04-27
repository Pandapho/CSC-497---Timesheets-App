import React from 'react'
import "./popup.css"
class Approve extends React.Component {
    state={
        date: "",
        name: "",
        pass: "",
        status: "Approve"
    }
    save = () => {
        if(this.state.name === "admin" && this.state.pass === "admin"){
            this.props.ok(this.state.status === "Approve" ? "True" : "False")
            // console.log("ss" , this.state)
        }else {
            alert("Wrong Credentials")
        }
    }
    render() {
        const {date , name} = this.state
      return (
        <div className='popup'>
          <div className='popup_inner' style={{    height: "275px"}}>
          <a href="#" onClick={this.props.closePopup} class="close" />
            <h2>Username</h2>
            <input type="text"
                onChange={(e) => this.setState({name : e.target.value})}
            />
            <br/>
            <h2>Password</h2>
            <input type="password"
                onChange={(e) => this.setState({pass : e.target.value})}
            />
            <br/>
            <h2>Select Status</h2>
            <select value={this.state.status} onChange={(e) => this.setState({status : e.target.value})}>
                <option value="Approve">Approve</option>
                <option value="Un Approve">Not Approve</option>
            </select>
              <br/>
            <button disabled={this.state.status === "" || this.state.name === "" || this.state.pass === ""} class="get" onClick={this.save}>Save</button>
          </div>
        </div>
      );
    }
}

export default Approve