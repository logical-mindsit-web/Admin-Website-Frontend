import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for routing

const NotificationComponent = () => {
 // const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Request permission for browser notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const socket = new WebSocket('ws://localhost:5000');

    // Log WebSocket connection
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    // Handle incoming WebSocket messages
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.type === 'NEW_DOCUMENT') {
        const notificationData = message.data;
        
        // Add the notification to the state
        // setNotifications((prevNotifications) => [
        //   ...prevNotifications,
        //   notificationData,
        // ]);

        // If the tab is not focused, show a system notification
        if (document.hidden) {
          if (Notification.permission === 'granted') {
            const notification = new Notification('New Document Added', {
              body: `Title: ${notificationData}`,
            });

            // Add click event to notification to route to the respective page
            notification.onclick = () => {
              window.focus(); // Bring the browser window to focus
              if (notificationData === 'adminpages') {
                navigate('/admin-user');
              } else if (notificationData === 'users'){
                navigate('/user-details');
              } else if (notificationData === 'robots'){
                navigate('/user-robot');
              } else if (notificationData === 'robotmsgs'){
                navigate('/Robotmsg');
              } else {
                navigate('/');
              }
               // Assuming you have a route like /document/:id
            };
          }
        } else {
          alert(`New document added: ${notificationData}`);
        }
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [navigate]);

  return (
    <div>
      {/* Optionally, render notifications list */}
     
      {/* <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>{notification.title}</strong>: {notification.content}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default NotificationComponent;