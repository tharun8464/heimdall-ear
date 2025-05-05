import {
	ProSidebar,
	Menu,
	MenuItem,
	SubMenu,
	SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { XIDashboardRoutes } from "../../routes";
import {
	AiOutlineMenu,
	AiOutlineClose,
	AiOutlineConsoleSql,
	AiOutlineUser,
	AiOutlineHome,
	AiOutlinePlus,
	AiOutlineClockCircle,
} from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import swal from "sweetalert";

import { BsGrid, BsCameraVideo } from "react-icons/bs";
import { FiMail, FiLayers } from "react-icons/fi";
import { CiTimer } from "react-icons/ci";
import React, { useEffect } from "react";
import "../../assets/stylesheet/sidebar.scss";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { ImHome } from "react-icons/im";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { LogoutAPI } from "../../service/api";
import ls from 'localstorage-slim';
import PlayGamesComponent from "../Cognition/PlayGamesComponent";
import styles from "../../assets/stylesheet/sidebar.module.css"
import { getStorage, removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";


const Sidebar = () => {
	const [open, setOpen] = React.useState(true);
	const [toggled, setToggled] = React.useState(true);
	const [collapsed, setCollapsed] = React.useState(false);
	const hasWindow = typeof window !== "undefined";
	const [close, setClose] = React.useState(null);
	const [user, setUser] = React.useState(null);
	const [arr, setArr] = React.useState([]);

	const Logout = async () => {
		//let user = await getSessionStorage("user");
		let user = await JSON.parse(getSessionStorage("user"));
		user = JSON.parse(user);
		let res = await LogoutAPI(user._id);
		await removeSessionStorage("user");
		await removeStorage("access_token");
		await removeStorage("refresh_token");
		await removeSessionStorage("user_type");
		window.location.href = "/login";
	};
	const [permission, setPermissions] = React.useState({
		add_jobs: true,
		add_users: true,
		list_candidates: true,
		default: true,
	});

	function getWindowDimensions() {
		const width = hasWindow ? window.innerWidth : null;
		const height = hasWindow ? window.innerHeight : null;
		return {
			width,
			height,
		};
	}

	const [windowDimensions, setWindowDimensions] = React.useState(
		getWindowDimensions()
	);

	React.useEffect(() => {
		if (hasWindow) {
			function handleResize() {
				setWindowDimensions(getWindowDimensions());
			}
			setClose(getWindowDimensions().width);

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, [hasWindow]);
	const handleToggle = () => {
		if (close < 1336) {
			setToggled(!toggled);
			setCollapsed(!collapsed);
		}
	};

	React.useEffect(() => {
		const initial = async () => {
			//let user1 = JSON.parse(await getSessionStorage("user"));
			let user1 = await JSON.parse(getSessionStorage("user"));
			let token = await getStorage("access_token");
			let user = await getUserFromId({ id: user1?._id }, token);
			setUser(user.data.user);
		};
		initial();
	}, []);

	const [profileCompleted, setProfileCompleted] = React.useState(false);
	const [pendingProfile, setPendingProfile] = React.useState(false);
	React.useEffect(() => {
		const fetchUser = async () => {
			let access_token = getStorage("access_token");
			//let user = JSON.parse(await getSessionStorage("user"));
			let user = await JSON.parse(getSessionStorage("user"));
			let user1 = await getUserFromId({ id: user?._id }, access_token);
			if (
				!user1?.data?.user?.profileImg ||
					!user1?.data?.user?.linkedinurl ||
					user1?.data?.user?.tools.length !== 0 ? user1?.data?.user?.tools.length == 0 : user1?.data?.user?.skillsFeedback.length == 0
			) {
				setProfileCompleted(false);
			} else {
				setProfileCompleted(true);
			}
			if (user1?.data?.user?.status === "Pending") {
				setPendingProfile(true);
			} else {
				setPendingProfile(false);
			}
		};
		fetchUser();
	}, [profileCompleted, pendingProfile]);

	return (
		<div className="sidebarComponent z-20">
			<div className="h-screen fixed top-20 left-0">
				<div className="absolute text-gray-800 text-xl left-5 -top-14" style={{ zIndex: 18 }}>
					<AiOutlineMenu
						className="text-md menu-bar"
						onClick={handleToggle}
						style={{ zIndex: 20 }}
					/>
				</div>

				<ProSidebar
					className="fixed left-0 h-screen z-0 text-left active text-gray-500"
					style={{ backgroundColor: "#FAFAFA", zIndex: -1 }}
					breakPoint="xl"
					collapsed={collapsed}
					toggled={toggled}
					onToggle={handleToggle}
				>
					<SidebarContent className="text-left mx-2 mt-2">
						<Menu iconShape="square">
							<MenuItem
								className="text-gray-700 font-semibold flex"
								active={window.location.pathname === `/XI/` || window.location.pathname === `/XI`}
							>
								<p className="text-xl flex mx-2">
									<BsGrid />
									<p className="text-sm mx-4 text-gray-700 font-semibold">Dashboard</p>
								</p>
								<Link to={`/XI/`} />
							</MenuItem>

							<p className="text-gray-400 font-bold text-xs mx-4 mt-5">Menu</p>
							{XIDashboardRoutes.map((item, id) => (
								item.hide === false &&
								<MenuItem
									key={id}
									className={arr.includes(id) ? "text-gray-800 font-bold" : "text-gray-400 font-semibold"}
									active={window.location.pathname === `/XI${item.path}`}
									icon={item.icon}
								>
									{item.name}
									<Link to={`/XI${item.path}`} />
								</MenuItem>
							))}
						</Menu>
					</SidebarContent>

					<div className="mx-4 my-24">
						<div className="flex m-2 cursor-pointer" onClick={Logout}>
							<p className="text-gray-700 mx-4 py-2 font-semibold">
								<MdOutlineLogout />
							</p>
							<p className="text-gray-700 font-semibold py-1">Log Out</p>
						</div>
					</div>
				</ProSidebar>
			</div>
		</div>
	);
};

export default Sidebar;
