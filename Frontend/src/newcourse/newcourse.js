import React, { useState } from 'react';
import './newcourse.css'

const MainContainer = () => {
    return (
      <div className="main-container">
        <div className="left-panel">
          <CourseDetails />
        </div>
        <div className="right-panel">
          <ChapterManager />
          <PricingSection />
          <ResourceSection />
        </div>
      </div>
    );
  };
  
  const CourseDetails = () => (
    <div className="course-details">
      <div className="course-name">
        <h2>Course Name</h2>
        <input type="text" placeholder="Enter Course Name" />
      </div>
      <div className="course-description">
        <h2>Course Description</h2>
        <textarea placeholder="Enter Course Description"></textarea>
      </div>
      <div className="course-image">
        <h2>Upload Course Image</h2>
        <input type="file" />
      </div>
    </div>
  );
  const ChapterManager = () => {
    const [chapters, setChapters] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); // Track which chapter is being edited
  
    const handleAddChapter = () => {
      // Set new chapters and then update editing index
      setChapters(prevChapters => {
        const newChapters = [...prevChapters, { name: '', description: '', isNew: true }];
        // Set the editing index after the new chapters array is created
        setEditingIndex(newChapters.length - 1);
        return newChapters;
      });
    };
  
    const handleChapterChange = (index, field, value) => {
      setChapters(prevChapters => prevChapters.map((chapter, idx) => {
        if (idx === index) {
          return { ...chapter, [field]: value };
        }
        return chapter;
      }));
    };
  
    const toggleEdit = (index) => {
      if (editingIndex === index) {
        setEditingIndex(null); // Toggle off if clicking the same chapter
      } else {
        setEditingIndex(index); // Open editor for clicked chapter
      }
    };
  
    return (
      <div className="chapter-manager">
        <h2>Course Chapters</h2>
        <button onClick={handleAddChapter}>Add a Chapter</button>
        <ul>
          {chapters.map((chapter, index) => (
            <li key={index} onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling when clicking on inputs
              toggleEdit(index);
            }}>
              {editingIndex === index ? (
                <div onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside the form */}
                  <input
                    type="text"
                    placeholder="Chapter Name"
                    value={chapter.name}
                    onChange={(e) => handleChapterChange(index, 'name', e.target.value)}
                  />
                  <textarea
                    placeholder="Chapter Description"
                    value={chapter.description}
                    onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                  />
                </div>
              ) : (
                <h3>{chapter.name || "New Chapter"}</h3>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const PricingSection = () => (
    <div className="pricing-section">
      <h2>Course Price</h2>
      <input type="text" placeholder="Set Course Price" />
    </div>
  );
  
  const ResourceSection = () => (
    <div className="resource-section">
      <h2>Resources</h2>
      <p>Upload a file:</p>
      <input type="file" />
    </div>
  );
  
  export default MainContainer;