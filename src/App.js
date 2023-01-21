import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

function App() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ text: '', username: '' });
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      var socket = socketIOClient('https://362c-2804-2484-84fb-6b00-c924-b48e-90ae-c01.sa.ngrok.io', { transports: ['websocket', 'polling', 'flashsocket'] });
      setSocket(socket);

        socket.on('new message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('initial messages', (msgs) => {
            setMessages(msgs);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit('new message', newMessage);
        setNewMessage({ text: '', username: '' });
    }

    return (
        <div>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.username}: {message.text}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    value={newMessage.username}
                    onChange={(event) =>
                        setNewMessage({ ...newMessage, username: event.target.value })
                    }
                    placeholder="Nome de usuário"
                />
                <input
                    value={newMessage.text}
                    onChange={(event) =>
                        setNewMessage({ ...newMessage, text: event.target.value })
                    }
                    placeholder="Mensagem"
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default App;
