import { useState } from 'react';
import ContactDetailsPopup from '../../../../Pages/UserDashboard/UserProfileComponents/ContactDetailsPopup';
import styles from './MobileContactSection.module.css';
const MobileContactSection = ({ userDetails }) => {
    const [isEditing, setIsEditing] = useState(false)
    const handleEdit = () => {
        setIsEditing(true)
    }

    const part = !userDetails?.user?.linkedinurl ? "" : userDetails?.user?.linkedinurl?.split("/")
    let linkedinUserName

    if (part !== "") {
        for (let i = 0; i < part.length; i++) {
            if (part[i] === "in" && i < part.length - 1) {
                linkedinUserName = part[i + 1];
                break;
            }
        }
    }

    return (isEditing ? <ContactDetailsPopup isMobile={true} setIsEditing={setIsEditing} /> :
        <div className={`${styles.ContactSection} rounded-md p-3 `}>
            <div className="flex justify-between">
                <h1 className="font-bold">Contact</h1>
                <span onClick={handleEdit} style={{ color: "var(--primary-green)" }}>
                    Edit
                </span>
            </div>
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td className="font-bold sm:text-sm">Email</td>
                        <td className="text-right">{userDetails?.user?.email}</td>
                    </tr>
                    <tr>
                        <td className="font-bold sm:text-sm">Phone</td>
                        <td className="text-right">{userDetails?.user?.contact}</td>
                    </tr>
                    <tr>
                        <td className="font-bold sm:text-sm">Location</td>
                        <td className="text-right">{userDetails?.user?.location}</td>
                    </tr>
                    <tr>
                        <td className="font-bold sm:text-sm">LinkedIn</td>
                        <td className="text-right">{linkedinUserName}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MobileContactSection;
