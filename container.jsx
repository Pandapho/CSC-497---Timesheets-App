import React, { useEffect, useState } from "react";
import exportFromJSON from 'export-from-json'
import "./container.css";
import moment from "moment"
import Popup from "./popup";
import Approve from "./approve";


function Container() {
  const [form, setForm] = useState({
    Sunday: {Date: ""},
    Monday: {Date: ""},
    Tuesday: {Date: ""},
    Wednesday: {Date: ""},
    Thursday: {Date: ""},
    Friday: {Date: ""},
    Saturday: {Date: ""},
  });


  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [data, setData] = useState({})
  const jsonExportHandler = () => {
    const days = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday", "Saturday"]
    if(!form.userName || !form.activity || days.some(day => (Object.keys(form[day]).length === 0 || Object.keys(form[day]).length === 1))){
      alert("Please enter All fields")
      return;
    }
    const data = form
    const fileName = form.userName
    const exportType = 'json'
    // Export json File
    exportFromJSON({ data, fileName, exportType })
  }


  const setDays = () => {
    const obj = {...form}
    var currentDate = moment();
    debugger
    var weekStart = currentDate.clone().startOf('week');
    var weekEnd = currentDate.clone().endOf('week');

    var days = [];
    const daysName = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday", "Saturday"]
    for (let i = 0; i <= 6; i++) {
        obj[daysName[i]]["Date"] = moment(weekStart).add(i, 'days').format("YYYY-MM-DD")

    };
    console.log(obj)
    setForm(obj)
  }



  const getTimeSheet = (data) => {
    console.log(data)
    if(data.date && data.name){
      fetch(`https://usahealthtimesheet.azurewebsites.net/api/GetUserTimesheet?name=${data.name}&date=${data.date.split("/").reverse().join("")}&code=BeQOiat23yYMK8ihgU6LiBaB0YOVtIb8MuBa8TK0NWmxLFxHNmCk6Q==`)
        .then(res => res.json())
        .then(data => {
          if(data.id && data.author){
            setData(data)
            console.log("date" , data)
            var days = [];
            for (let i = 0; i <= 6; i++) {
              console.log("1234" , moment(data.weekDate.split(" ")[0]).format("YYYY-MM-DD"))
                days.push(moment(new Date(data.weekDate)).add(i, 'days').format("YYYY-MM-DD"));

            };
            console.log("days" , days)
            setForm({
              Sunday: {Date: days[0], Hours : data.sunHours},
              Monday: {Date: days[1], Hours : data.monHours},
              Tuesday: {Date: days[2], Hours : data.tuesHours},
              Wednesday: {Date: days[3], Hours : data.wedHours},
              Thursday: {Date:  days[4], Hours : data.thursHours},
              Friday: {Date: days[5], Hours : data.thursHours},
              Saturday: {Date: days[6], Hours : data.friHours},
              activity: data.activity,
              userName: data.author,
              id: data.id
            })
            setOpen(!open)
          }
          else alert("No Data Found")
        })
    }
  }


  
  useEffect(() => {
    setDays()
  }, [])
  const saveServer = () => {
    const days = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday", "Saturday"]
    if(!form.userName || !form.activity || days.some(day => (Object.keys(form[day]).length === 0 || Object.keys(form[day]).length === 1))){
      alert("Please enter All fields")
      return;
    }
    form.approved = "True"
    fetch('https://usahealthtimesheet.azurewebsites.net/api/RegisterTime', {
      method: 'post',
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      body: JSON.stringify(form)
    })
      .then(res => {
        if(res.status === 200){
          alert('Successfully saved');
          // setForm({});
          setDays()
        }else {
          alert('Error: Did not save');

        }
        console.log(res)
      })
      .catch(err => {
        console.log("err" , err)
        alert(err.status || "Error: Failed to save")
      })

    }
    const updateStatus = (status) => {
      data.status = status
      fetch('https://usahealthtimesheet.azurewebsites.net/api/ApproveTimesheet?code=Wmz659Lu4OG95FlT8i7ifIJNSwFNFRvLHwRuxlQHSai342hzxbYchw==', {
        method: 'post',
        // headers: {
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json'
        // },
        body: JSON.stringify(data)
      })
        .then(res => {
          if(res.status === 200){
            setOpen1(false);
            alert('Success: Time Sheet Approved');
          }else {
            alert('Error: Status did not update');
  
          }
          console.log(res)
        })
        .catch(err => {
          console.log("err" , err)
          alert(err.status || "Error: Status did not update")
        })
  
      }
  const handler = (e) => {
    const formData = { ...form };
    const keys = e.target.name.split("-");
    if(keys[1] == "Hours" && Math.sign(e.target.value) === -1){
      alert("Please enter positive number")
      return;
    }
    formData[keys[0]][keys[1]] = e.target.value;
    console.log(formData);
    setForm(formData);
  };
  const nameHandler = (e) => {
    const formData = { ...form };
    formData[e.target.name] = e.target.value;
    setForm(formData);
  }
  return (
    <div className="container">
      <div class="header" style={{height:150}} >
        <img src="https://www.southalabama.edu/departments/publicrelations/brand/images/logos/USA_Logo_Left_White.png" alt="logo" style={{width:800, height:120, paddingTop:20}}/>
        <h1>Header</h1>
        <p>My supercool header</p>
      </div>

      <div className="userNameField">
        <label for="userName"><h3>User Name</h3></label>
        <br/> 
        <input name="userName" value={form.userName} placeholder="Name" onChange={nameHandler} type="text" />
        {
          form.id && form.id &&  <>
            <label for="userName"><h3>ID</h3></label>
            <input style={{paddingLeft: "10px"}} value={form.id} placeholder="ID" onChange={nameHandler} type="text" />
          </>
        }
      </div>
      <div className="d-flex align-item-center">
        <div className="row1 alignCenter"  style={{marginRight:0}}>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10"}>
              <h3>Sunday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                name="Sunday-Date"
                value={form.Sunday.Date}
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                name="Sunday-Hours"
                min="0"
                value={form.Sunday.Hours || null}
                onChange={handler}
                
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Monday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                value={form.Monday.Date}
                name="Monday-Date"
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                min="0"
                name="Monday-Hours"
                onChange={handler}
                value={form.Monday.Hours || null}
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Tuesday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                name="Tuesday-Date"
                value={form.Tuesday.Date}
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                min="0"
                name="Tuesday-Hours"
                onChange={handler}
                value={form.Tuesday.Hours || null}
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Wednesday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                name="Wednesday-Date"
                value={form.Wednesday.Date}
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                min="0"
                name="Wednesday-Hours"
                value={form.Wednesday.Hours}
                onChange={handler}
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Thursday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                name="Thursday-Date"
                value={form.Thursday.Date}
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                min="0"
                name="Thursday-Hours"
                onChange={handler}
                value={form.Thursday.Hours || null}
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Friday</h3>
            </div>
            <div className="p-10">
              <input type="date" name="Friday-Date" value={form.Friday.Date} onChange={handler} />
            </div>
            <div className="p-10">
              <input
                type="number"
                min="0"
                name="Friday-Hours"
                value={form.Friday.Hours || null}
                onChange={handler}
                placeholder="Hours Worked"
              />
            </div>
          </div>
          <div className="d-flex align-item-center flex-end">
            <div className={"p-10 " + (form.id ? "bg-color" : "")}>
              <h3>Saturday</h3>
            </div>
            <div className="p-10">
              <input
                type="date"
                name="Saturday-Date"
                value={form.Saturday.Date}
                onChange={handler}
              />
            </div>
            <div className="p-10">
              <input
                type="number"
                name="Saturday-Hours"
                min="0"
                onChange={handler}
                value={form.Saturday.Hours || null}
                placeholder="Hours Worked"
              />
            </div>
          </div>
        </div>
        <div className="row2 alignCenter" style={{marginLeft:0}}>
          <div>
            <textarea
              name="activity"
              value={form.activity || null}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
              placeholder="Type Activity/Milestone Completed here"
              id="Activity"
              cols="75"
              rows="10"
            ></textarea>
          </div>
          <div style={{paddingLeft:40}}>
            <button onClick={saveServer} className="submit">Submit</button>
            <button disabled={form.id ? false : true} onClick={() => setOpen1(!open1)} style={{background:"#023e8a", color:"white"}} className="submit">Approve</button>
            <button onClick={() => setOpen(!open)} className="edit">Import</button>
          </div>
          {open && <Popup ok={getTimeSheet} closePopup={() => setOpen(false)} text={"Hello"} />}
          {open1 && <Approve ok={updateStatus} closePopup={() => setOpen1(false)} text={"Hello"} />}
        </div>
      </div>
    </div>
  );
}

export default Container;
