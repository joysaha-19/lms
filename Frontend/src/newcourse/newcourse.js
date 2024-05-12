import React, { useState , useRef ,useEffect } from 'react';
import './newcourse.css';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import UploadIcon from '@mui/icons-material/Upload';

const MainContainer = () => {
  const token=localStorage.getItem("accesstoken");

  const nav=useNavigate(null);
  const [editing, setEditing] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [addingChapter, setAddingChapter] = useState(false);
    const [newChapterName, setNewChapterName] = useState('');
    const [newChapterDescription, setNewChapterDescription] = useState('');
    const [editingIndex, setEditingIndex] = useState(-1);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseCost, setCourseCost] = useState('');

    const [editCourseTitle, setEditCourseTitle] = useState(false);
    const [editCourseDescription, setEditCourseDescription] = useState(false);
    const [editCourseCost, setEditCourseCost] = useState(false);
    const [completedFields, setCompletedFields] = useState(0);
    const [loading1,setLoading1]=useState(true);
    const [teacherid, setteacherid] = useState();

    const[publishmessage,setpublishmessage]=useState("Publish");

    const { username } = useParams();
    async function fetchTeacher(username) {
      const encodedUsername = encodeURIComponent(username);
      const url = `http://localhost:5000/lms/teachers/getteacher?username=${encodedUsername}`;
      try {
        const response = await fetch(url,{
          headers: {
            'Authorization': `Bearer ${token}`,
            'username':`${username}`

          }
        });
        const data = await response.json();
        setteacherid(data["_id"]);
       
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
      } finally {
      }
      setLoading1(false);
    }



  
    useEffect(() => {
      fetchTeacher(username);
      
  
    }, []);
    




    const submitCourse = async () => {
    if (completedFields < 5) {
        alert("All fields are mandatory");
        return;
    }

    // Image is now a Base64 string, included directly in JSON
    const courseData = {
        course_name: courseTitle,
        tag: courseDescription,
        course_instructor: username,
        course_cost: Number(courseCost),
        enrolled: [],
        teacherid: teacherid,
        chapters: chapters,
    };

    try {
        const response = await fetch('http://localhost:5000/lms/courses/addcourse', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData)
        });
        const responseData = await response.json();

        if (response.ok) {
            console.log('Course added successfully:', responseData);
            setpublishmessage("Published Successfully");
            setTimeout(() => {
              nav(`/teacher/${username}`)            }, 2000);
        } else {
            console.error('Failed to add course:', responseData);
        }
    } catch (error) {
        console.error('Failed to send course data:', error);
    }
};



    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const fieldsFilled = [
            courseTitle !== '',
            courseDescription !== '',
            courseCost !== '',
            image !== null,
            chapters.length > 1
        ];
        setCompletedFields(fieldsFilled.filter(Boolean).length);
    }, [courseTitle, courseDescription, courseCost, image, chapters]);

    const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // This is now a Base64 string
        };
        reader.readAsDataURL(file);
    }
};


    const handleClickIcon = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleEditClick = (setter) => {
        setter(true);
    };

    const handleDoneClick = (setter) => {
        setter(false);
    };
 

  function handleAddOrEditChapter(action) {
    if (action === 'add') {
      const newChapter = {
        name: newChapterName,
        description: newChapterDescription
      };
      setChapters([...chapters, newChapter]);
    } else if (action === 'edit') {
      const updatedChapters = chapters.map((item, index) =>
        index === editingIndex ? { ...item, name: newChapterName, description: newChapterDescription } : item
      );
      setChapters(updatedChapters);
    }
    setNewChapterName('');
    setNewChapterDescription('');
    setAddingChapter(false);
    setEditing(false);
    setReadOnly(false);
    setEditingIndex(-1);
  }

  function handleEditChapter(index) {
    setEditing(true);
    setReadOnly(false);
    setAddingChapter(true);
    setEditingIndex(index);
    setNewChapterName(chapters[index].name);
    setNewChapterDescription(chapters[index].description);
  }

  function handleChapterInfoClick(index) {
    setEditing(false);
    setReadOnly(true);
    setAddingChapter(true);
    setNewChapterName(chapters[index].name);
    setNewChapterDescription(chapters[index].description);
  }

  function handleDeleteChapter(index) {
    const updatedChapters = chapters.filter((_, idx) => idx !== index);
    setChapters(updatedChapters);

    // Check if the deleted chapter is the one being viewed or edited
    if (index === editingIndex||readOnly) {
        // Reset these values to close the editing or read-only form
        setAddingChapter(false);
        setEditing(false);
        setReadOnly(false);
        setEditingIndex(-1);
        setNewChapterName('');
        setNewChapterDescription('');
    }
}


  function moveChapterUp(index) {
    if (index === 0) return;
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
    setChapters(newChapters);
  }

  function moveChapterDown(index) {
    if (index === chapters.length - 1) return;
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
    setChapters(newChapters);
  }

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

 const nochapters=<div className='no_chapters'>
No chapters have been added
 </div>

 const add_chapters=<div className='add_chapter_box'>
 <div className='add_chapter_area'>
   <div className='add_chapters_title'>
     <p>Add Chapters (min 2)</p>
   </div>
   <div className='chapter_controls_box'>
     <div className='add_chapter_button' style={{ display: !addingChapter ? 'flex' : 'none' }} onClick={() => { setAddingChapter(true); setEditing(false); setReadOnly(false); }}>
       <AddCircleOutlineIcon />&nbsp;<p>Add chapter</p>
     </div>
     <div className='cancel_button' style={{ display: addingChapter ? 'flex' : 'none' }} onClick={() => { setAddingChapter(false); setEditing(false); setReadOnly(false); setNewChapterName(''); setNewChapterDescription(''); }}><p>Cancel</p></div>
     <div className='add_button' style={{ display: addingChapter && !readOnly ? 'flex' : 'none' }} onClick={() => handleAddOrEditChapter(editing ? 'edit' : 'add')}>
       <p>{editing ? 'Save' : 'Add'}</p>
     </div>

     <div className='title_text_box' style={{ display: addingChapter ? 'flex' : 'none' }}>
       <input
         className='title_text'
         type='text'
         placeholder='E.g.: Introduction'
         value={newChapterName}
         onChange={e => setNewChapterName(e.target.value)}
         readOnly={readOnly}
         style={{ color: readOnly ? 'gray' : '' ,cursor:readOnly?'not-allowed':''}}
       />
       <div className='boxtag'>Chapter Title</div>
     </div>
     <div className='title_description_box' style={{ display: addingChapter ? 'flex' : 'none' }}>
       <textarea
         className='title_text'
         type='text'
         placeholder='In this chapter, we will...'
         style={{ resize: 'none', color: readOnly ? 'gray' : '',cursor:readOnly?'not-allowed':'' }}
         value={newChapterDescription}
         onChange={e => setNewChapterDescription(e.target.value)}
         readOnly={readOnly}
       ></textarea>
       <div className='boxtag'>Chapter Objective</div>
     </div>
   </div>
 </div>

 <div className='added_chapters_area'>
   <div className='added_chapters_container' >
     
   {chapters.length ? chapters.map((chapter, index) => (
     <div className='added_chapter_box' key={index}>
       <div className='navigate_box'>
         <div className='upbox' onClick={() => moveChapterUp(index)}>
           <ArrowUpwardIcon />
         </div>
         <div className='downbox' onClick={() => moveChapterDown(index)}>
           <ArrowDownwardIcon />
         </div>
       </div>
       <div className='added_chapter_info' onClick={() => handleChapterInfoClick(index)}>
         <div className='added_chapter_name'><p>{truncateText(chapter.name, 40)}</p></div>
       </div>
       <div className='edit_delete_box'>
         <div className='editbox' onClick={() => handleEditChapter(index)}><EditIcon /></div>
         <div className='deletebox' onClick={() => handleDeleteChapter(index)}><DeleteIcon /></div>
       </div>
     </div>
   )) : <div className='no_chapters'>No chapters have been added</div>}
   </div>
 </div>
</div>

const inputStyle = (editable) => ({
  cursor: editable ? 'text' : 'not-allowed',
  color: editable ? 'black' : 'gray'
});

const handleSelectChange = (e) => {
  setCourseDescription(e.target.value);
};


if (loading1 ) {
  return <div className="loading">Loading course info...</div>;
}
  return (
    <div className='newcourse_parent'>
    <div className='leftpanel'>
        <div className='newcourse_titlebox'>
            <div className='newcourse_title_container'><p>New Course Setup</p>
                <p style={{ fontSize: '14px' }}>Completed Fields:{completedFields}/5</p>
            </div>
        </div>
        <div className='newcourse_namebox'>
            <div className='newcourse_namebox_title'><p>Course Title</p></div>
            <div className='newcourse_name_textbox'>
                <input
                    className='course_name_text'
                    type='text'
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                    readOnly={!editCourseTitle}
                    style={inputStyle(editCourseTitle)}
                    placeholder='Enter Course Title'
                />
                {editCourseTitle ? (
                    <DoneIcon className='tickicon' onClick={() => handleDoneClick(setEditCourseTitle)} />
                ) : (
                    <EditIcon className='editicon' onClick={() => handleEditClick(setEditCourseTitle)} />
                )}
            </div>
        </div>
        <div className='newcourse_descriptionbox'>
            <div className='newcourse_namebox_title'><p>Course Tag</p></div>
            <div className='newcourse_description_textbox'>
            <select className='course_description_text' value={courseDescription} onChange={handleSelectChange} style={{ width: '90%', height: '35px' }}>
              <option value="">None</option>
              <option value="Engineering">Engineering</option>
              <option value="Art">Art</option>
              <option value="Medical">Medical</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Architecture">Architecture</option>



          </select>
                
            </div>
        </div>
        <div className='newcourse_imagebox'>
            <div className='newcourse_namebox_title'><p>Course Thumbnail</p></div>
            <div className='newcourse_image_area'>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                {!image && (
                    <div style={{ textAlign: 'center' }}>
                        Upload thumbnail here
                        <UploadIcon className='uploadicon' onClick={handleClickIcon} />
                    </div>
                )}
                {image && (
                    <>
                        <img src={image} alt="Uploaded" style={{ width: '400px', height: '200px', objectFit: 'contain' }} />
                        <UploadIcon className='tickicon' onClick={handleClickIcon} />
                    </>
                )}
            </div>
        </div>
    </div>
    <div className='rightpanel'>
      {/* <div className='exitbox' >
        <div className='newcourse_tag'></div>
        <div className='exitbutton' onClick={()=>nav('/teacher')} style={{position:'absolute',top:'30%',right:'5%'}}>EXIT</div>
      </div> */}
        <div className='newcourse_chapterbox'>
            {add_chapters}
        </div>
        <div className='newcourse_cost'>
            <div className='newcourse_namebox_title'><p>Course Cost in $</p></div>
            <div className='newcourse_name_textbox' style={{bottom:'25%'}}>
                <input
                    className='course_name_text'
                    type='number'
                    value={courseCost}
                    onChange={e => setCourseCost(e.target.value)}
                    readOnly={!editCourseCost}
                    style={inputStyle(editCourseCost)}
                    placeholder='Enter cost of course in $'
                />
                {editCourseCost ? (
                    <DoneIcon className='tickicon' onClick={() => handleDoneClick(setEditCourseCost)} />
                ) : (
                    <EditIcon className='editicon' onClick={() => handleEditClick(setEditCourseCost)} />
                )}
            </div>
        </div>
        <div className='submitoptions'>
            <div className='publishoptionbutton'  onClick={submitCourse}>{publishmessage}</div>
            <div className='saveoptionbutton' onClick={()=>nav(`/teacher/${username}`)}>Exit</div>
        </div>
    </div>
</div>
  );
};

export default MainContainer;