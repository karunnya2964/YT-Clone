// src/components/CreateVideoComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateVideoComponent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);

  const handleCreateVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/createVideo',
        { title, description, isSubscriberOnly },
        { headers: { Authorization: token } }
      );
      console.log('Video created successfully.');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      </div>
  )
  }