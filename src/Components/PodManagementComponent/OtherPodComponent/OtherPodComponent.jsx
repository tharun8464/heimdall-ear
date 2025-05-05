import CreatePodComponent from "../CreatePodComponent/CreatePodComponent";
import UserAvatar from "../../../assets/images/UserAvatar.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./OtherPodComponent.module.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Popover } from "@headlessui/react";
import { notify } from "../../../utils/notify";
import { useState,useEffect } from "react";
import usePod from "../../../Hooks/usePod";
import usePodMember from "../../../Hooks/usePodMember";
import getStorage from "../../../service/storageService";
import Loader from "../../Loader/Loader";

const OtherPodComponent = ({state,setState, jobId, setEditPod,setShowCreatePod,showCreatePod,setIsAddToPod,isAddToPod,createdPod}) => {
  const { allPodsData } = useSelector((state) => state.pod);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [allPods, setAllPods] = useState();
  const [showPods, setShowPods] = useState(false);
  const {handleDeletePod,handleGetPodsByCompanyId,handleGetAllPods}=usePod();
  const { handleGetAllPodMembers } = usePodMember();

  const initial = async () => {    
    await handleGetAllPods(jobId);
    setAllPods(allPodsData);
    setShowPods(true);
  }

  useEffect(() => {
    initial();
  }, []);

useEffect(()=>{
  setAllPods(allPodsData);
},[allPodsData])

  const handleEditPod=(_id,jobId, name, podFunction, podType, members)=>{
    setPopoverVisible(!isPopoverVisible);
    setIsAddToPod(true);//!isAddToPod
    setShowCreatePod(true);
    setState(
      { 
        items:state?.items?.filter((value=>!members?.some(item=>item['_id']===value['_id']))), 
        selected: members 
      });
    setEditPod({
      id:_id,
      jobId,  
      isEdited:true
    })
  }

  const handleRemovePod=async(podId,name)=>{    
    const res=await handleDeletePod(podId);  
    setAllPods(allPods.filter(item=>item._id!==podId));  
    await handleGetAllPodMembers();
    await handleGetAllPods(jobId);  
    if(res){
      notify(`Pod ${name} is deleted!`,"success");
    }
    setPopoverVisible(!isPopoverVisible);
  }

  // const podData = [
  //   {
  //     name: "Design",
  //   },
  //   {
  //     name: "Engineering",
  //   },
  // ];

  // const addedPodsData = [
  //   {
  //     name: "Management",
  //     customName: "Poduct mgmt",
  //     images: [UserAvatar, UserAvatar, UserAvatar, UserAvatar],
  //   },
  // ];
  return (
    <div>
      {/* <CreatePodComponent state={state} podType={"other"} jobId={jobId} /> */}
      {
        showPods?    
      <div className={styles.PodsWrapper}>
        {allPods?.map(({_id, jobId, name, podFunction, podType,members }) => {
          if (podType === "other") {
            return (
              <div className={styles.AddedPod}>
                <div className={styles.NamesWrapper}>
                  <span className={styles.Name}>{name}</span>
                  <div className={styles.CustomNameWrapper}>
                    <span className={styles.CustomName}>{podFunction}</span>
                  </div>
                </div>
                <div>
                  <div className={styles.ImageWrapper}>
                  {members.map((item, index) => (
                    <img src={item?item.image:UserAvatar} alt="" className={`${styles.Img} `} />
                  ))}
                </div>
                
                <Popover className={`relative  text-sm  ${styles.Popover}`}>
                    <Popover.Button
                      className="focus:outline-0  border-none rounded-xl text-[#888888]"
                      onClick={() => setPopoverVisible(!isPopoverVisible)}
                    >
                      {/* <BiDotsVerticalRounded className="m-auto" /> */}
                     
                      <MoreVertIcon className={styles.VertIcon} />
                    </Popover.Button>                   
                    <Popover.Panel
                      className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                      style={{ display: isPopoverVisible ? "block" : "none" }}
                    >
                      <div
                        className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}
                      >
                        <div
                          className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                        >                        
                          <span
                            className="font-semibold rounded-xl flex w-full justify-left"
                            href="/"
                            onClick={() => handleEditPod(_id,jobId, name, podFunction, podType, members)}
                          >
                            Edit Pod
                          </span>
                        </div>
                        <div
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                      onClick={() =>handleRemovePod(_id,name)}
                    >                    
                      <span className="font-semibold rounded-xl flex w-full justify-left">
                        Remove Pod
                      </span>
                    </div>
                      </div>
                    </Popover.Panel>
                  </Popover>
                </div>
              </div>
            )
          } else {
            return null;
          }
        })}
        {/* {podData.map(({ name }) => {
          return (
            <div className={styles.OtherPod}>
              <span className={styles.Name}>{name}</span>
              <span className={styles.AddEmployees}>Add Employees</span>
            </div>
          );
        })} */}
      </div>:<Loader/>
}
    </div>
  );
};

export default OtherPodComponent;
