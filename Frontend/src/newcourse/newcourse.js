import React, { useState } from 'react';
import './newcourse.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const MainContainer = () => {
 const [addingchapter,setaddingchapter]=useState(false);

  const [chapters,setchapters]=useState([
    {
      "name":"Intro to phil",
      "description":"here we will learn about the various aaaaaaaaaaaaa"
    }
  ])

  function handleAddbutton(n)
  {
    if(n===1)
      setaddingchapter(false);
    else
    setaddingchapter(true);
  }
    return (
      <div className='newcourse_parent'>
       <div className='add_chapter_box'>
       <div className='add_chapter_area'>
        <div className='add_chapters_title'>
        <p>Add Chapters</p>

        </div>
        <div className='chapter_controls_box'>
        <div className='add_chapter_button' style={{display:!addingchapter?'flex':'none'}} onClick={()=>handleAddbutton(0)}>
          <AddCircleOutlineIcon></AddCircleOutlineIcon>&nbsp;<p>{" Add chapter"}</p>
        </div>
        <div className='cancel_button' style={{display:addingchapter?'flex':'none'}} onClick={()=>handleAddbutton(1)}><p>Cancel</p></div>
        <div className='add_button' style={{display:addingchapter?'flex':'none'}} onClick={()=>handleAddbutton(1)}><p>Add</p></div>

        <div className='title_text_box' style={{display:addingchapter?'flex':'none'}}>
        <input className='title_text' type='text' placeholder='Eg: Introduction'></input>
        <div className='boxtag'>Chapter Title</div>
        </div>
        <div className='title_description_box' style={{display:addingchapter?'flex':'none'}}>
        <textarea className='title_text' type='text' placeholder='In this chapter we will...' style={{resize:'none'}}></textarea>
        <div className='boxtag'>Chapter Objective</div>
        </div>
        </div>
       </div>

       <div className='added_chapters_area'>
       </div>

       </div>
      </div>
    );
  };
  
 
  export default MainContainer;