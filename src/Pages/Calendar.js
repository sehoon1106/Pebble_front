import React, {useState, useContext} from 'react'
import './Calendar.css'
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import {ReactComponent as Arrow} from './left_arrow.svg'
import { useNavigate } from 'react-router-dom';  

const month_str_list = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

const Calendar = () => {
    const { server_data } = useContext(AppContext);
    const user_id = useParams().user_id;

    const navigate = useNavigate();  

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
    
    if (server_data[user_id] === undefined){
        return <div>404 Not Found</div>
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the month
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Index of the first day (0 = Sunday)

    const tiles = [];
    for (let i = 0; i < firstDayIndex; i++) {
        tiles.push(null); // Empty slots before the first day
    }

    for (let day = 1; day <= daysInMonth; day++) {
        tiles.push(day);
    }

    // Handle tile click
    const handleTileClick = (day) => {
        const date = currentYear+'-'+(currentMonth+1)+'-'+day
        if (server_data[user_id] === undefined || server_data[user_id]["diary"][date] === undefined){
            return;
        }
        navigate(`/${user_id}/${date}`)
    };

    const handleArrowClick = (direction) => {
        if (direction === "left"){
            if (currentMonth === 0){
                setCurrentYear(currentYear-1)
                setCurrentMonth(11)
            }
            else{
                setCurrentMonth((currentMonth-1)%12)
            }
        }
        else{
            if (currentMonth === 11){
                setCurrentYear(currentYear+1)
                setCurrentMonth(0)
            }
            else{
                setCurrentMonth((currentMonth+1)%12)
            }
        }
    }

    const generate_tile = (day, index) => {
        const date = currentYear+'-'+(currentMonth+1)+'-'+day
        const have_diary = server_data[user_id]["diary"][date] ? true : false
        let diarys = server_data[user_id]["diary"][date] ? server_data[user_id]["diary"][date] : []
        console.log(server_data[user_id]["diary"][date])

        return(
        <div key={index} className={`tile ${have_diary ? 'active' : ''}`} onClick={() => handleTileClick(day)}>
            {   
                day && (
                <>
                    <div className='white_circle'/>
                    {diarys.length>1 && (
                        <>
                            <div className='red_circle'/>
                            <div className="diary_num">{diarys.length}</div>
                        </>
                        )}
                    {have_diary&& <img src={diarys[0]["img"]} alt="placeholder" style={{height:'100%'}} />}
                    <div className="day">{day}</div>
                    <div/>
                </>
                )
            }
        </div>)
    }

    return (
        <div className='calendarPage'>
            <div className='left_arrow active' onClick={()=>handleArrowClick("left")}><Arrow></Arrow></div>
            <div className='right_arrow active' onClick={()=>handleArrowClick("right")}><Arrow></Arrow></div>
            <div className="calendar">
                <div className="header">
                    <div className="month">{month_str_list[currentMonth]}</div>
                    <div className="name"> Welcome {server_data[user_id]["user_name"]}</div>
                    <div className="totalstudytime">You studied <strong>45 hours</strong> this month</div>
                </div>
                <div className="days">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className="tiles">
                    {tiles.map((day, index) => (generate_tile(day, index)))}
                </div>
            </div>
        </div>
    )
}

export default Calendar