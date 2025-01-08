import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import CardGrid from "../GlobalSettings/CardsGrid";
import VersionChange from "../GlobalSettings/GlobalSettingFiles/VersionChange";
import MetadataChange from "../GlobalSettings/GlobalSettingFiles/MetadataChange"
import Autodissinfectanalytics from "../GlobalSettings/GlobalSettingFiles/Autodissinfectanalytics";

import CreateUserPage from "../DetailsUplode/CreateUserPage";
import CreateAdminPage from "../DetailsUplode/CreateAdminPage";

import RobotForm from "../DetailsUplode/CreateRobotForUser";

import AdminList from "../ListPages/AdminList";

import UserList from "../ListPages/RobotUsers/RobotUsersList1";
import RobotList from "../ListPages/RobotUsers/RobotUsersList2";

import UsersList from "../ListPages/UserList/UsersList1";
import UserDetailsList from "../ListPages/UserList/UsersList2";
import UpdateUser from "../ListPages/UserList/UsersList2";

import RobotMsgList1 from "../ListPages/RobotMsg/RobotMsgList1";
import RobotMsgList2 from "../ListPages/RobotMsg/RobotMsgList2";
import RobotMsgList3 from "../ListPages/RobotMsg/RobotMsgList3";

import RobotAnalyticsList1 from "../ListPages/RobotAnalytics/RobotAnalyticsList1";
import RobotAnalyticsList2 from "../ListPages/RobotAnalytics/RobotAnalyticsList2";

import BookSession from "../BookingRobot/BookSession";
import Sessiondetails from "../BookingRobot/Sessiondetails";
import DetailsView from "../BookingRobot/DetailsView";

import RobotVersionList1 from "../ListPages/RobotVersion/RobotVersionList1";
import RobotVersionList2 from "../ListPages/RobotVersion/RobotVersionList2"; 

import Login from "../Login/Login.js" // login main page
import CardGridDashboard from "../HomePage/CardGrid.js"; // dashboard

import RobotImage from "../ModelImages/RobotImage"
import Uplodeimage from "../ModelImages/uplodeimage"
import Viewimage from "../ModelImages/viewimage"

import Employeecard from "../Employeedata/Employeecard"
import EmployeeTable from "../Employeedata/EmployeeFiles/EmployeeIdTable"
import EmployeeIdForm from "../Employeedata/EmployeeFiles/EmployeeIdForm"
import TicketForm from "../Employeedata/EmployeeFiles/EnterTicketForm"
import EmployeeList from "../Employeedata/EmployeeFiles/EmployeeTicketsList"

import Dashboard from "../RobotAnalyticsGraph/Dashboard"


const getUserRole = () => {
  return localStorage.getItem("role");
};

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = getUserRole();
  if (allowedRoles.includes(userRole)) {
    return element;
  } else {
    return <Navigate to="/" />;
  }
};
const AfterLoginRoutes = () => (
  <Routes>
<Route path="/" element={<Login />} />

    <Route path="/create-user" element={<CreateUserPage />} />
    <Route
      path="/create-admin"
      element={
        <ProtectedRoute
          allowedRoles={["Hr", "ProjectManager"]}
          element={<CreateAdminPage />}
        />
      }
    />

    {/* Global Setting Rout */}
    <Route path="/card-global" element={<CardGrid />} />
    <Route path="/update-Version" element={<VersionChange />} />
    <Route path="/metadata-Change" element={<MetadataChange />} />
    <Route path="/dissnfection" element={<Autodissinfectanalytics />} />


     {/* Home page Rout */}
     <Route path="/card" element={<CardGridDashboard />} />
    <Route path="/users-list" element={<UsersList />} />
    <Route path="/user-details/:email" element={<UserDetailsList />} />
    <Route path="/update-user" element={<UpdateUser />} />

    <Route path="/admin-user" element={<AdminList />} />

    <Route path="/robot-form" element={<RobotForm />} />

    <Route path="/user-robot" element={<UserList />} />

    <Route path="/robots/:email" element={<RobotList />} />

    <Route path="/RobotMsgList" element={<RobotMsgList1 />} />
    <Route path="/robot/:robotId" element={<RobotMsgList2 />} />
    <Route path="/camera-images/:messageId" element={<RobotMsgList3 />} />

    <Route path="/Robot-Booking" element={<BookSession />} />
    <Route path="/Booking-details" element={<Sessiondetails />} />
    <Route path="/sessions/:id" element={<DetailsView />} />


    <Route path="/robot-analytics" element={<RobotAnalyticsList1 />} />
    <Route path="/robot-analytics/:encodedEmail" element={<RobotAnalyticsList2 />}/>

    <Route path="/update-apppermession" element={<RobotVersionList1 />} />
    <Route path="/appdetails/:emailId" element={<RobotVersionList2 />} />

    <Route path="/RobotImage" element={<RobotImage />} />
    <Route path="/Uplodeimage" element={<Uplodeimage />} />
    <Route path="/Viewimage" element={<Viewimage />} />

    <Route path="/RobotAnalytics" element={<Dashboard />} />

    <Route path="/Employeecard" element={<Employeecard />} />
    <Route path="/EmployeeTable" element={<EmployeeTable />} />
    <Route path="/EmployeeIdForm" element={<EmployeeIdForm />} />
    <Route path="/TicketForm" element={<TicketForm />} />
    <Route path="/EmployeeList" element={<EmployeeList/>}/>

  </Routes>
);

export default AfterLoginRoutes;


