import React, { useState } from 'react';
import './CalendarList.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'


const parseDate = (day) => {
    return (''+(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear());
}

function CalendarList (){
    const [date, setDate] = useState(new Date());
    /*const initialList = () => {
        if (localStorage.getItem(parseDate(date))) {
            return(JSON.parse(localStorage.getItem(parseDate(date))));
        } else {
            return (['']);
        }
    }
    const [toDoList, setToDoList] = useState(initialList());
    */
    const loadList = async (date) =>{
        console.log("Checking for lists...");
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
        if (!newToDoList.ok || !newListData.list) {
            console.log("...none found");
            document.getElementById(0).value = '';
            return(['']);
        } else {
            console.log(newListData.list);
            document.getElementById(0).value = newListData.list[0];
            return(newListData.list);
        }
    }
    const [toDoList, setToDoList] = useState(['']);
    const setList = async () => {
        console.log("Setting list...");
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

        /*if (localStorage.getItem(parseDate(newDate))) {
            setToDoList(JSON.parse(localStorage.getItem(parseDate(newDate))));
            document.getElementById(0).value = JSON.parse(localStorage.getItem(parseDate(newDate)))[0];
        }
        else {
            setToDoList(['']);
            document.getElementById(0).value = '';
        }*/

        loadList(newDate);

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
        //localStorage.setItem(parseDate(date), JSON.stringify(toDoList));
        setList();
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