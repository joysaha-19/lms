import React, { useState } from 'react';
import './newcourse.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MainContainer = () => {
  const [editing, setEditing] = useState(false);
  const [addingChapter, setAddingChapter] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDescription, setNewChapterDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  const [chapters, setChapters] = useState([
    {
      name: "Introduction to AI",
      description: "Explore the fundamentals of Artificial Intelligence and its impact on technology and society."
    },
    {
      name: "History of AI",
      description: "Trace the development of AI from early concepts to modern algorithms and breakthroughs."
    },
    {
      name: "AI and Machine Learning",
      description: "Understand how machine learning algorithms form the backbone of AI and its practical applications."
    },
    {
      name: "Ethics in AI",
      description: "Discuss the ethical considerations, potential biases, and future implications of AI in decision-making processes."
    }
  ]);

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
    setEditingIndex(-1);
  }

  function handleDeleteChapter(index) {
    const updatedChapters = chapters.filter((_, idx) => idx !== index);
    setChapters(updatedChapters);
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

  function handleEditChapter(index) {
    setEditing(true);
    setAddingChapter(true);
    setEditingIndex(index);
    setNewChapterName(chapters[index].name);
    setNewChapterDescription(chapters[index].description);
  }

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <div className='newcourse_parent'>
      <div className='add_chapter_box'>
        <div className='add_chapter_area'>
          <div className='add_chapters_title'>
            <p>Add Chapters</p>
          </div>
          <div className='chapter_controls_box'>
            <div className='add_chapter_button' style={{ display: !addingChapter ? 'flex' : 'none' }} onClick={() => { setAddingChapter(true); setEditing(false); }}>
              <AddCircleOutlineIcon />&nbsp;<p>Add chapter</p>
            </div>
            <div className='cancel_button' style={{ display: addingChapter ? 'flex' : 'none' }} onClick={() => { setAddingChapter(false); setEditing(false); setNewChapterName(''); setNewChapterDescription(''); }}><p>Cancel</p></div>
            <div className='add_button' style={{ display: addingChapter ? 'flex' : 'none' }} onClick={() => handleAddOrEditChapter(editing ? 'edit' : 'add')}>
              <p>{editing ? 'Save' : 'Add'}</p>
            </div>

            <div className='title_text_box' style={{ display: addingChapter ? 'flex' : 'none' }}>
              <input
                className='title_text'
                type='text'
                placeholder='E.g.: Introduction'
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
              />
              <div className='boxtag'>Chapter Title</div>
            </div>
            <div className='title_description_box' style={{ display: addingChapter ? 'flex' : 'none' }}>
              <textarea
                className='title_text'
                type='text'
                placeholder='In this chapter, we will...'
                style={{ resize: 'none' }}
                value={newChapterDescription}
                onChange={(e) => setNewChapterDescription(e.target.value)}
              ></textarea>
              <div className='boxtag'>Chapter Objective</div>
            </div>
          </div>
        </div>

        <div className='added_chapters_area'>
          <div className='added_chapters_container'>
            
            {chapters.map((chapter, index) => {
              return (
                <div className='added_chapter_box' key={index}>
                  <div className='navigate_box'>
                    <div className='upbox' onClick={() => moveChapterUp(index)}>
                      <ArrowUpwardIcon />
                    </div>
                    <div className='downbox' onClick={() => moveChapterDown(index)}>
                      <ArrowDownwardIcon />
                    </div>
                  </div>
                  <div className='added_chapter_info'>
                    <div className='added_chapter_name'><p>{truncateText(chapter.name, 40)}</p></div>
                  </div>
                  <div className='edit_delete_box'>
                    <div className='editbox' onClick={() => handleEditChapter(index)}><EditIcon /></div>
                    <div className='deletebox' onClick={() => handleDeleteChapter(index)}><DeleteIcon /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
