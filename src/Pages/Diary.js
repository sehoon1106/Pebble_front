import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import {ReactComponent as Arrow} from './left_arrow.svg'
import {ReactComponent as Download} from './download.svg'
import './Diary.css'
import html2canvas from 'html2canvas'
import saveAs from 'file-saver'


const Diary = () => {
    const paperRef = useRef(null)
    const { server_data } = useContext(AppContext);
    const user_id = useParams().user_id;
    const date = useParams().date;
    const [diaryindex, setIndex] = useState(0)
    const navigate = useNavigate();
    if (server_data[user_id] === undefined || server_data[user_id]["diary"][date] === undefined){
        return <div>404 Not Found</div>
    }
    const diaries = server_data[user_id]["diary"][date]


    const handleArrowClick = (direction) => {
        if (direction === "left"){
            if (diaryindex > 0){
                setIndex(diaryindex-1)
            }
            else{
                return
            }
        }
        else{
            if (diaryindex < diaries.length-1){
                setIndex(diaryindex+1)
            }
            else{
                return
            }
        }
    }

    const capture = async () => {
        if(!paperRef.current){
            return
        }

        const canvas = await html2canvas(paperRef.current)
        canvas.toBlob((blob) => {
            if (blob){
                saveAs(blob, `${date}_${diaryindex}.png`)
            }
        })
    }

    return (
        <div className='diaryPage'>
            <div className='backbutton' onClick={()=>(navigate(`/${user_id}`))}><span><Arrow className="backbuttonarrow"/></span><span>Back to Calendar</span></div>
            <div className='downloadbutton' onClick={capture}><span><Download className="downloadbuttonicon"/></span></div>
            <div className={`left_arrow ${diaryindex === 0 ? '':'active'}`} onClick={()=>handleArrowClick("left")}><Arrow className={`${diaryindex === 0 ? 'arrow':'arrow active'}`}></Arrow></div>
            <div className={`right_arrow ${diaryindex === diaries.length-1 ? '':'active'}`} onClick={()=>handleArrowClick("right")}><Arrow className={`${diaryindex === diaries.length-1 ? 'arrow':'arrow active'}`}></Arrow></div>
            <div className='paper' ref={paperRef}>
                <div className='diary'>
                    <div className='date diarycomponent'><span className='templatetext'>Date: </span><span className='kidtext'>{date}</span></div>
                    <div className='study_time diarycomponent'><span className='templatetext'>Studied time: </span><span className='kidtext'>{diaries[diaryindex]["study_time"]}</span></div>
                    <img src={diaries[diaryindex]["img"]} className="diaryimage diarycomponent"></img>
                    <div className='title diarycomponent'><span className='templatetext'>Title: </span><span className='kidtext'>{diaries[diaryindex]["title"]}</span></div>
                    <div className='diarycontent diarycomponent kidtext'>{diaries[diaryindex]["content"]}</div>
                </div>
            </div>
        </div>
    )
}

export default Diary