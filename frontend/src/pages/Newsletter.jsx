import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Newsletter = () => {

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !message) {
            toast.error('Veuillez remplir tous les champs.');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/app/send-newsletter/', {
                subject,
                message,
            });
            toast.success(response.data.message);
            setSubject('');
            setMessage('');
        } catch (error) {
            toast.error('Erreur lors de l\'envoi de la newsletter.');
        }
    };

  return (
    <div>
      <h2>Envoyer la Newsletter</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Sujet de la newsletter</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={handleSubjectChange}
                        required
                    />
                </div>
                <div>
                    <label>Message de la newsletter</label>
                    <textarea
                        value={message}
                        onChange={handleMessageChange}
                        required
                    />
                </div>
                <button type="submit">Envoyer la Newsletter</button>
            </form>
    </div>
  )
}

export default Newsletter
