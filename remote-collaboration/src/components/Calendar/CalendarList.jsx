import React, { useState } from 'react';
import './CalendarList.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'


function CalendarList (){
    const [toDoList, setToDoList] = useState(['']);
    const [date, setDate] = useState(new Date());
    //const [userLists, setUserLists] = useState([]);
    //localStorage.setItem(date.getTime(), toDoList);
    /*const loadLists = async () =>{
        const e = {
            email: localStorage.getItem("email")
        };
        const newToDoLists = await fetch("http://localhost:3000/api/getToDoLists", {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify(e)
        });
        const newListData = await newToDoLists.json();
        if (!newToDoLists.ok) {
            toast.error(newListData.message || "Couldn't fetch projects");
            return
        }
        setUserLists(newListData.lists)
    }*/
    const changeDate = (newDate) => {
        console.log("Current date: " + date);
        console.log(toDoList);

        setDate(newDate);

        if (localStorage.getItem(parseDate(newDate))) {
            setToDoList(JSON.parse(localStorage.getItem(parseDate(newDate))));
            document.getElementById(0).value = JSON.parse(localStorage.getItem(parseDate(newDate)))[0];
            console.log("Data exists!");
        }
        else {
            setToDoList(['']);
            document.getElementById(0).value = '';
        }

        console.log("New date: " + newDate);
        console.log(JSON.parse(localStorage.getItem(parseDate(newDate))));
    }
    const changeList = (event, index) => {
        var newList = [...toDoList];
        newList[index] = event.target.value;
        setToDoList(newList);
    }
    const handleInputs = () => {
        setToDoList([...toDoList, '']);
    }
    const saveList = () => {
        localStorage.setItem(parseDate(date), JSON.stringify(toDoList));
        console.log(toDoList);
        //TODO: Connect to database
    }
    const parseDate = (day) => {
        return (''+(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear());
    }

    return (
        <div>
            <div className="calendar">
                <Calendar onChange={changeDate} value={date}/>
            </div>
            <div className="to-do">
                <h2>To-Do List {parseDate(date)}
                <button className="list-button" onClick={handleInputs}>+</button>
                </h2>
                <ul className="list">
                    {toDoList.map((task, index) => (
                        <li key = {index}>
                            <input id = {index} className="list-item" type="text" defaultValue={task} placeholder="What do you need to do?" onChange={(event) => changeList(event, index)}/>
                        </li>
                    ))}
                </ul>
                <button className="list-button" onClick={saveList}>Save</button>
            </div>
        </div>
    )
}

export default CalendarList