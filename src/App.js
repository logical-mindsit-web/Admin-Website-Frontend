// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import Header from './HomePage/Header';
// import Footer from './HomePage/Fooder';
// import AfterLoginRoutes from './Routes/AfterLoginRoutes ';


// const App = () => {
//   const isAuthenticated = () => {
//     const token = localStorage.getItem('token');
//     return !!token;
//   };
//   return (
//     <Router>
//       <div style={styles.app}>
//       {isAuthenticated() && <Header />}
//         <div style={styles.content}>
         
//            <AfterLoginRoutes />
        
//         </div>
//         {isAuthenticated() && <Footer/>}
        
//       </div>
//     </Router>
//   );
// }

// const styles = {
//   app: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//   },
//   content: {
//     flex: 1,
//     // paddingBottom: '60px',
//     position: 'relative',
//   },
// };

// export default App;




// // import React from 'react';
// // import { BrowserRouter as Router } from 'react-router-dom';

// // import Header from './HomePage/Header';
// // import Footer from './HomePage/Fooder';
// // import BeforeLoginRoutes from './Routes/BeforeLoginRoutes ';
// // import AfterLoginRoutes from './Routes/AfterLoginRoutes ';



// // const App = () => {
// //   return (
// //     <Router>
// //       <div style={styles.app}>
// //         <Header /> // navbar
// //         <div style={styles.content}>
// //            <BeforeLoginRoutes />
// //            <AfterLoginRoutes />
      
// //         </div>
// //         <Footer /> //footer
// //       </div>
// //     </Router>
// //   );
// // }

// // const styles = {
// //   app: {
// //     display: 'flex',
// //     flexDirection: 'column',
// //     minHeight: '100vh',
// //   },
// //   content: {
// //     flex: 1,
// //     paddingBottom: '60px',  // Ensure space for footer
// //     position: 'relative',
// //   },
// // };

// // export default App;


// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
// import Header from './HomePage/Header';
// import AfterLoginRoutes from "./Routes/AfterLoginRoutes "
// import Footer from "./HomePage/Fooder";
// const App = () => {
//   const isAuthenticated = () => {
//     const token = localStorage.getItem('token');
//     return !!token;
//   };

//   const AppWrapper = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (isAuthenticated()) {
//         navigate('/card');
//       } else {
//         navigate('/');
//       }
//     }, []);

//     return (
//       <div style={styles.app}>
//         {isAuthenticated() && <Header />}
//         <div style={styles.content}>
//           <AfterLoginRoutes />
//         </div>
//         {isAuthenticated() && <Footer />}
//       </div>
//     );
//   };

//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// };

// const styles = {
//   app: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//   },
//   content: {
//     flex: 1,
//     position: 'relative',
//   },
// };

// export default App;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Header from './HomePage/Header';
import AfterLoginRoutes from "./Routes/AfterLoginRoutes "
import Footer from "./HomePage/Fooder";
import { useLocation } from 'react-router-dom';
const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const AppWrapper = () => {

    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const path = location.pathname;
  
      if (isAuthenticated()) {
        if (path === '/') {
          navigate('/card'); 
        }
      } else {
        if (path !== '/') {
          navigate('/'); 
        }
      }
    }, [location.pathname]);

    return (
      <div style={styles.app}>
        {isAuthenticated() && <Header />}
        <div style={styles.content}>
          <AfterLoginRoutes />
        </div>
        {isAuthenticated() && <Footer />}
      </div>
    );
  };

  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
};

export default App;