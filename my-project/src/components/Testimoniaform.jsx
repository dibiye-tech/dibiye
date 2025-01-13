import React, { useState } from 'react'
import axios from 'axios';

const Testimoniaform = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
  
      try {
        const response = await axios.post('http://localhost:8000/concours/testimonials/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setSuccessMessage('Thank you for your testimonial!');
        setName('');
        setTitle('');
        setContent('');
        setImage(null);
      } catch (error) {
        setErrorMessage('There was an error submitting your testimonial. Please try again.');
      }
    };
  
    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Submit Your Testimonial</h2>
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Testimonial:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image:</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Submit
          </button>
        </form>
      </div>
    );
  };
  

export default Testimoniaform