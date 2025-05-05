import { Draggable, Droppable } from "react-beautiful-dnd";
import CustomInput from "../../CustomInput/CustomInput";
import styles from "./section.module.css";
import MemberCard from "./MemberCard";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { BiRightArrowAlt } from "react-icons/bi";
import TaggedMemberCard from "./TaggedMemberCard/TaggedMemberCard";
import usePodMember from "../../../Hooks/usePodMember";
import { PinDrop } from "@mui/icons-material";

function MiddleSection({ state, setState, jobId, isAddToPod, editPod, inputRef }) {
  const [selectFilter, setSelectFilter] = useState("All");
  // not to be confused with state.selected, this is for checkbox
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddNewMember, setShowAddNewMember] = useState(false);
  //console.log"selectedMembers:", selectedMembers);
  const [selectedMem, setSelectedMem] = useState(false);
  let [podMemberData, setPodMemberData] = useState([]);
  const [searchName, setSearchName] = useState();
  const [id,setId]=useState(jobId);
  const[ascendingOrder,setAscendingOrder]=useState(false);
  const { handleFilterPodMembersByName } = usePodMember();


  const handleFilterButton = (e) => {
    setSelectFilter(e.target.childNodes[0].data);

    if (e.target.childNodes[0].data === 'All') {
      setPodMemberData(state.items);
    }
    if (e.target.childNodes[0].data === "Tagged") {
      setPodMemberData(state.items.filter(item => item?.tag !== undefined));
    }
    if (e.target.childNodes[0].data === "Untagged") {
      setPodMemberData(state.items.filter(item => (item?.tag === undefined) || (item?.tag === null) || (item?.tag === '')));
    }
  }


  useEffect(() => {    
    setPodMemberData(state?.items);
  }, [state]);

  // Callback function to update selected members
  const handleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSearchMember = async (e) => {
    setSearchName(e.target.value);
    let searchData = await handleFilterPodMembersByName(e.target.value);
    if (searchData.length === 0) {
      setShowAddNewMember(true);
    }
  };
  
 
  const handleSort = () => {    
    setAscendingOrder(!ascendingOrder);   
    let data=[...podMemberData];  
    let sortedData = data.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return ascendingOrder ? -1 : 1;
      else if (nameA > nameB) return ascendingOrder ? 1 : -1;
      else return 0;
    })  
    setPodMemberData(sortedData);
  }

  const handleMoveSelectedMembers = () => {
    // const selectedMembersData = selectedMembers.map((memberId) => {
    //   return state.items.find((item) => item._id === memberId);
    // });
    const selectedMembersData = state.items.filter((item) => selectedMembers.includes(item._id));

    const membersLeft = state.items.filter((member) => !selectedMembers.includes(member._id));
    setState((prevState) => ({
      items: [...membersLeft],
      selected: [...prevState.selected, ...selectedMembersData],
    }));

    // reset
    setSelectedMembers([]);
  };

  const handleAddMember = () => {
    setShowAddNewMember(false);
    inputRef.current.focus();
    setSearchName('');
  }

  return (
    <>
      <div className={styles.MiddleSectionWrapper}>
        <div className={styles.MemberHeader}>
          <div style={{ marginBottom: "15px" }}>
            <p className={styles.MemberHeading}>Colleagues</p>
          </div>
          <div className={styles.inputIcons}>
            <i className={`fa fa-search ${styles.icon}`}></i>
            <CustomInput
              className={styles.inputField}
              type="text"
              placeholder="Search Colleague"
              onChange={handleSearchMember}
              value={searchName}
            />
          </div>
          {showAddNewMember && <div className={styles.Common} style={{ gap: "4px", marginBottom: "5px" }}
            onClick={handleAddMember}
          >
            <AiOutlinePlus
              style={{ color: "var(--primary-100, #228276)" }}
            ></AiOutlinePlus>
            <p style={{ cursor: "pointer" }}>Add New Colleague</p>
          </div>}
        </div>

        {selectedMembers.length !== 0 && (isAddToPod || editPod) ? (
          <div className={`${styles.common} ${styles.podOptionCont}`}>
            {/* <div className={styles.deleteIcon}>
              <AiFillDelete></AiFillDelete>
            </div> */}
            <div
              className={`${styles.common} ${styles.podOptionItemCont}`}
              onClick={() => handleMoveSelectedMembers()}
            >
              <div>
                <p>Move to pod</p>
              </div>
              <div className={styles.arrowIcon}>
                <BiRightArrowAlt></BiRightArrowAlt>
              </div>
            </div>
          </div>
        ) : null}
        {/* filterBox */}
        <div className={styles.filterBox}>
          <div className={styles.common} style={{ gap: "12px" }}>
            <button
              className={selectFilter !== "All" ? styles.filter : styles.newFilter}
              onClick={(e) => handleFilterButton(e)}
            >
              All
            </button>
            <button
              className={selectFilter !== "Tagged" ? styles.filter : styles.newFilter}
              onClick={(e) => handleFilterButton(e)}
            >
              Tagged
            </button>
            <button
              className={selectFilter !== "Untagged" ? styles.filter : styles.newFilter}
              onClick={(e) => handleFilterButton(e)}
            >
              Untagged
            </button>
          </div>

          <div>
            <i className={`fa fa-sort`} onClick={handleSort}></i>
          </div>
        </div>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {podMemberData?.map(({ name, designation, _id, tag, weightage, image, isAddedToPod,jobId }, index) => (
                <Draggable key={_id} index={index} draggableId={_id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.TestRow}
                    >
                      {selectFilter === "All" ? (
                        <MemberCard
                          // setCheckedMembers={setCheckedMembers}
                          id={id}
                          addedMembers={jobId}
                          isAddedToPod={isAddedToPod}
                          firstName={name}
                          designation={designation}
                          memberId={_id}
                          memberTag={tag}
                          image={image}
                          handleMemberSelection={handleMemberSelection}
                          weightage={weightage}
                        />
                      ) : null}
                      {selectFilter === "Tagged" ? (
                        <TaggedMemberCard
                          // setCheckedMembers={setCheckedMembers}
                          id={id}
                          isAddedToPod={isAddedToPod}
                          firstName={name}
                          designation={designation}
                          memberId={_id}
                          memberTag={tag}
                          weightage={weightage}
                          image={image}
                          handleMemberSelection={handleMemberSelection}
                          selectedMem={selectedMem}
                        />
                      ) : null}
                      {selectFilter === "Untagged" ? (
                        <TaggedMemberCard
                          // setCheckedMembers={setCheckedMembers}
                          isAddedToPod={isAddedToPod}
                          firstName={name}
                          designation={designation}
                          memberId={_id}
                          memberTag={tag}
                          weightage={weightage}
                          image={image}
                          handleMemberSelection={handleMemberSelection}
                          selectedMem={selectedMem}
                        />
                      ) : null}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
}

export default MiddleSection;
