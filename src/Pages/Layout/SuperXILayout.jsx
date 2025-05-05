// import React from "react";
// import { useParams } from "react-router-dom";
// import { ReactSession } from "react-client-session";

// // Components
// import { superXIDashboardRoutes } from "../../routes";
// import Navbar from "../../Components/AdminDashboard/Navbar";
// import Sidebar from "../../Components/SuperXIDashboard/Sidebar";
// import { getUserFromId, getUserIdFromToken, getProfileImage } from "../../service/api";
// import jsCookie from "js-cookie";
// import ls from 'localstorage-slim';
// const CompanyDashboard = () => {
//   let [comp, setComponent] = React.useState(null);
//   let { component } = useParams();
//   component = "/" + component;
//   let [user, setUser] = React.useState(null);

//   // Retrieve And Saves Access Token and User to Session
//   const [access_token, setAccessToken] = React.useState(null);
//   const [profileImg, setProfileImg] = React.useState(null);
//   React.useEffect(() => {
//     const tokenFunc = async () => {
//       let access_token1 = null;
//       let location = window.location.search;
//       const queryParams = new URLSearchParams(location);
//       const term = queryParams.get("a");

//       // If Token is passed in the url
//       if (term !== null && term !== undefined && term !== "null") {
//         await ls.remove("access_token");
//         access_token1 = term;
//         await setAccessToken(term);
//         await ls.set("access_token", term);

//         await setAccessToken(access_token1);

//         let user_id = await getUserIdFromToken({ access_token: access_token1 });
//         let a = await getStorage("access_token");
//         if (a === "null") {
//           let u = JSON.parse(await getStorage("user"));
//           await ls.set("access_token", u._id);
//         }
//         if (user_id) {
//           let user = await getUserFromId(
//             { id: user_id.data.user.user },
//             access_token1
//             );
            
            
//           await setUser(user.data.user.user);
//           if (user.invite) {
//             window.location.href = "/setProfile" + user.resetPassId;
//           }
//           if (user.profileImg) {
//             let image = await getProfileImage(
//               { id: user_id.data.user.user },
//               access_token1
//             );
//             setProfileImg(image.data.Image);
//             await ls.set(
//               "profileImg",
//               JSON.stringify(image.data.Image)
//             );
//           }
//           //console.log(user.data.user);
//           if (
//             user.data.user.access_valid === false ||
//             user.data.user.user_type !=="SuperXI"
//           )
//             window.location.href = "/login";
//           await ls.set("user", JSON.stringify(user.data.user));
//           // window.history.pushState({ url: "/user" }, "", "/user");
//           window.location.href="/superXI";
//         } else {
//           window.location.href = "/login";
//         }
//       } else {
//         let access_token = await getStorage("access_token");
//         await setAccessToken(access_token);
//         let user = JSON.parse(getStorage("user"));
//         await setUser(user);
//         if (user.access_valid === false || user.user_type !== "SuperXI") {
//           window.location.href = "/login";
//         }
//       }
//       let user = JSON.parse(getStorage("user"));
//       let token = getStorage("access_token");
//       if (!user || !token) {
//         window.location.href = "/login";
//       }
//     };

//     const func = async () => {
//       await tokenFunc();
//       let location = window.location.search;
//       const queryParams = new URLSearchParams(location);
//       const term = queryParams.get("a");
//       if (term) {
//         // window.history.pushState({ path: "/user" }, "", "/user");
//         window.location.href="/superXI";
//       }
//     };
//     func();
//   }, [access_token]);
//   React.useEffect(() => {
//     //console.log(component);
//     if (!component || component === "/undefined") {
//       setComponent(
//         superXIDashboardRoutes.filter((route) => route.path === "/")[0]
//           .component
//       );
//     } else {
//       let c = superXIDashboardRoutes.filter(
//         (route) => route.path === component
//       );
//       if (c[0]) setComponent(c[0].component);
//       else {
//         let c = superXIDashboardRoutes.filter(
//           (route) => route.path === component.split("superXI/")[1]
//         );
//         if (c[0]) setComponent(c[0].component);
//         else
//           setComponent(
//             superXIDashboardRoutes.filter(
//               (route) => route.path === "/superXI"
//             )[0].component
//           );
//       }
//     }
//   }, [component]);

//   return (
//     <div className="max-w-screen h-screen">
//      <div className="w-full bg-white  fixed z-50"> <Navbar user={user} /></div>

// <div className="flex w-full ">
//   <Sidebar className="h-screen fixed left-0">

//   </Sidebar>
//   <div className="justify-end ml-auto " style={{width:"82%" , marginTop:'75px'}}>{comp}</div>
// </div>
//     </div>
//   );
// };

// export default CompanyDashboard;
