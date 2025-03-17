import React, { useState } from 'react';
import './CalendarList.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'


const parseDate = (day) => {
    return (''+(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear());
}

function CalendarList (){
    const [date, setDate] = useState(new Date());
    const [loaded, setLoad] = useState(false);
    const loadList = async (date) =>{
        const e = {
            date : parseDate(date),
            email : localStorage.getItem("email")
        };
        const newToDoList = await fetch("http://localhost:3000/api/getList", {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify(e)
        });
        const newListData = await newToDoList.json();
        if (!newToDoList.ok || !newListData || !newListData.toDoList) {
            document.getElementById(0).value = '';
            return(['']);
        } else {
            document.getElementById(0).value = newListData.toDoList.list[0];
            return(newListData.toDoList.list);
        }
    }
    const [toDoList, setToDoList] = useState(['']);
    if (loaded===false){
        setLoad(true);
        loadList(date).then((value) => {setToDoList(value)});
    }
    const setList = async () => {
            try{
                const newlist = {
                    date : parseDate(date),
                    email: localStorage.getItem("email"),
                    list: toDoList,
                }
                const response = await fetch("http://localhost:3000/api/setList", {
                    method: "POST",
                    headers: {
                      "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(newlist)
                });
                const responseData = await response.json();
                if (!response.ok) {
                    toast.error(responseData.message || "Updating to-do list failed. Please try again");
                    return
                }
                    
            } catch (error){
                console.error("To-do list error:", error);
                toast.error("An error occurred during updating the to-do list. Please try again.")
            }
    }
    const changeDate = (newDate) => {
        setDate(newDate);
        loadList(newDate).then((value) => {setToDoList(value)});

 }
    const changeList = (event, index) => {
        var newList = [...toDoList];
        newList[index] = event.target.value;
        setToDoList(newList);
    }
    const handleInputs = () => {
        setToDoList([...toDoList, '']);
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
                <button className="list-button" onClick={setList}>Save</button>
            </div>
        </div>
    )
}

export default CalendarList