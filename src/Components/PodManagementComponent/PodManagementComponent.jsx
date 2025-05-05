import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./PodManagementComponent.module.css";
import RightSection from "./RightSection/RightSection";
import { useEffect, useState,useRef } from "react";
import LeftSection from "./components/LeftSection";
import MiddleSection from "./components/MiddleSection";
import usePod from "../../Hooks/usePod";
import { useSelector } from "react-redux";
import usePodMember from "../../Hooks/usePodMember";
import { useParams } from "react-router";

const PodManagementComponent = ({ jobId,setShowPopup,handleCreatePodClose }) => {
  const [isAddToPod, setIsAddToPod] = useState(false);
  const inputRef = useRef();
  const [editPod,setEditPod]=useState({  
      id:'',
      isEdited:false
  });
  const [state, setState] = useState({
    items: [],
    // {
    //   firstName: "Sudhanshu",
    //   lastName: "Soni",
    //   designation: "Engineer",
    //   tags: ["Critical"],
    //   weightage: 50,
    // },
    // {
    //   firstName: "Arun",
    //   lastName: "Gupta",
    //   designation: "Engineer",
    //   tags: ["Critical"],
    //   weightage: 20,
    // },

    selected: [
      // {
      //   firstName: "Jay",
      //   lastName: "",
      //   designation: "Founder",
      //   tags: ["Critical"],
      //   weightage: 50,
      // },
      // {
      //   firstName: "Aditya",
      //   lastName: "Malik",
      //   designation: "Founder",
      //   tags: ["Critical"],
      //   weightage: 50,
      // },
    ],
  });
  const { handleGetAllPods } = usePod();
  const { handleGetAllPodMembers, handleDeletePodMember } = usePodMember();
  // const { id: jobId } = useParams();

  const { allPodMembersData, filteredPodMemberByNameData } = useSelector(
    (state) => state.podMember
  );


  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  };

  const id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  const getList = (id) => state[id2List[id]];

  const removeItemFromDroppable3 = (itemId) => {
    const updatedItems = state.items.filter((item) => item._id !== itemId);

    setState({
      items: updatedItems,
      selected: state.selected,
    });
  };
  const removeSelectedItemFromDroppable3 = (itemId) => {
    const updatedSelectedItems = state.selected.filter((item) => item._id !== itemId);
    const updatedItems = state.items.filter((item) => {
      for (let i = 0; i < updatedSelectedItems.length; i++) {
        if (item._id !== updatedSelectedItems[i]._id) {
          return item;
        }
      }
    });
    setState({
      items: updatedItems,
      selected: updatedSelectedItems,
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (destination?.droppableId === "droppable3" && source?.droppableId === "droppable2") {
      removeSelectedItemFromDroppable3(state?.selected[source?.index]?._id);
      handleDeletePodMember(state?.selected[source?.index]?._id);
    }
    else if (destination?.droppableId === "droppable3") {
      removeItemFromDroppable3(state?.items[source?.index]?._id);
      handleDeletePodMember(state?.items[source?.index]?._id);
    } else {
      if (!destination) {
        return;
      }

      const sourceList = getList(source.droppableId);
      const destinationList = getList(destination.droppableId);

      if (source.droppableId === destination.droppableId) {
        // Reorder items within the same list
        const reorderedItems = reorder(
          sourceList,
          source.index,
          destination.index
        );

        if (source.droppableId === "droppable") {
          setState({ items: reorderedItems, selected: state.selected });
        } else if (source.droppableId === "droppable2") {
          setState({ items: state.items, selected: reorderedItems });
        }
      } else {
        // Move an item from one list to another
        const result = move(sourceList, destinationList, source, destination);

        setState({
          items: result.droppable,
          selected: result.droppable2,
        });
      }
    }
  };

  useEffect(() => {
    handleGetAllPods(jobId);
    handleGetAllPodMembers();
  }, []);

  useEffect(() => {
    if (filteredPodMemberByNameData?.length) {
      setState((prevState) => ({
        ...prevState,
        items: filteredPodMemberByNameData,
      }));
    } else if (allPodMembersData?.length && state?.selected?.length === 0) {
      setState((prevState) => ({ ...prevState, items: allPodMembersData }));
    } else if(allPodMembersData?.length &&editPod.isEdited&&state?.selected?.length !== 0){
      const updatedItems=allPodMembersData?.filter((value=>!state?.selected?.some(item=>item['_id']===value['_id'])));
      setState((prevState) => ({ ...prevState, items: updatedItems }));
    } else if(allPodMembersData?.length) {
      const updatedItems=allPodMembersData?.filter((value=>!state?.selected?.some(item=>item['_id']===value['_id'])));
      setState((prevState) => ({ ...prevState, items: updatedItems }));
    }
  }, [allPodMembersData, filteredPodMemberByNameData]);

  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <div className={styles.Wrapper} >
        <LeftSection jobId={jobId} inputRef={inputRef} />
        <div className={styles.MembersList}>
          <MiddleSection state={state} setState={setState} jobId={jobId} isAddToPod={isAddToPod} editPod={editPod} inputRef={inputRef}/>
        </div>
        <RightSection state={state} setState={setState} editPod={editPod} handleCreatePodClose={handleCreatePodClose} setEditPod={setEditPod} jobId={jobId} setIsAddToPod={setIsAddToPod} isAddToPod={isAddToPod} setShowPopup = {setShowPopup} />
      </div>
    </DragDropContext>
  );
};

export default PodManagementComponent;
