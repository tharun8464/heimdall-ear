import { BsUnlockFill } from "react-icons/bs";
import { BiSolidLockAlt, BiSolidLockOpen, BiSolidLockOpenAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "./AddPodComponent.module.css";
import { useEffect, useState } from "react";
import { notify } from "../../../utils/notify.js";
import ManagePodComponent from "../ManagePodComponent/ManagePodComponent";
import usePod from "../../../Hooks/usePod.js";
import { useParams } from "react-router-dom";
import PodManagementLaunch from "../../PodManagementComponent/PodManagementLaunch";

function AddPodComponent({ allPods, selectedPods, setSelectedPods }) {
  //console.log("selectedPods:", selectedPods);
  //console.log("allPods:", allPods);
  const [editedValues, setEditedValues] = useState({});
  const { handleUpdatePod } = usePod();
  const [showManagePods, setShowManagePodsPopup] = useState(false);
  const [podsData, setPodsData] = useState(null);
  //console.log("podsData:", podsData);
  const [showCreate, setShowCreatePod] = useState(false);
  const { id } = useParams();

  const handlePodWeightageChange = (newValue, pod, index) => {
    setEditedValues({
      ...editedValues,
      [pod._id]: parseFloat(newValue ? newValue : 0), // Assuming the value is in percentage
    });
  };

  const initial = allPods => {
    let data = {};
    let length = allPods.length;
    const totalWeightage = allPods.reduce((acc, cur) => acc + cur.podWeightage, 0);
    for (let pod of allPods) {
      if (totalWeightage > 1 || totalWeightage < 1) {
        data[pod._id] = (1 / length).toFixed(2) * 100;
      } else {
        data[pod._id] = pod.podWeightage * 100;
      }
    }
    setPodsData(allPods);
    setEditedValues(data);
  };

  useEffect(() => {
    initial(allPods);
  }, [selectedPods, allPods]);

  // handleLockOpen
  const handleLockOpen = async pod => {
    const podIds = [];
    let data = {
      podWeightageLock: false,
      podIds,
    };
    let res = await handleUpdatePod(pod?._id, data);

    if (res) {
      let data = podsData.map(item =>
        item._id === res?.updatedPod?._id ? res?.updatedPod : item,
      );

      setPodsData(data);
    }
  };

  // Handle lock close
  const handleLockClose = async pod => {
    let ids = podsData.map(item => (item._id !== pod._id ? item._id : ""));
    const podIds = ids.filter(item => item !== "");
    let data = {
      podWeightageLock: true,
      podWeightage: editedValues[pod._id] || pod?.podWeightage * 100,
      podIds,
    };

    if (editedValues[pod._id] <= 100 && editedValues[pod._id] >= 0) {
      let res = await handleUpdatePod(pod?._id, data);
      initial(res?.allUpdatedPods ? res?.allUpdatedPods : allPods);
      setPodsData(res?.allUpdatedPods ? res?.allUpdatedPods : allPods);
      if (res) {
        notify("Pod weightage is successfully updated", "success");
      }
    } else {
      notify("Pod weight-age should not be greater than 100!", "error");
    }
  };
  useEffect(() => { }, [allPods]);

  const handleShowManagePods = () => {
    setShowManagePodsPopup(true);
  };

  const handleCreatePod = () => {
    setShowCreatePod(true);
  };

  const handleCreatePodClose = async () => {
    setShowCreatePod(false);
  };

  return (
    <>
      {showCreate ? (
        <PodManagementLaunch handleCreatePodClose={handleCreatePodClose} />
      ) : null}
      {showManagePods ? (
        <ManagePodComponent
          setShowManagePodsPopup={setShowManagePodsPopup}
          jobId={id}
          setPodsData={setPodsData}
          setSelectedPods={setSelectedPods}
          handleCreatePod={handleCreatePod}
          allPods={selectedPods?.length === 0 ? allPods : selectedPods}
        />
      ) : null}
      <div className={styles.Wrapper}>
        {podsData?.map((pod, index) => {
          return pod?.isSelected ? (
            <div className={styles.ItemCont}>
              <div className={styles.TextCont}>
                <div>
                  <p>{pod?.name} </p>
                </div>
                <div className={styles.BorderBox}>
                  <p>{pod?.podFunction}</p>
                </div>
              </div>
              <div className={styles.SideCont}>
                <div style={{ display: "flex" }}>
                  <div className={styles.PercentBox}>
                    {pod?.podWeightageLock === false ? (
                      // Render an input field when podWeightageLock is true
                      // <input
                      //   type="text"
                      //   defaultValue={`${(pod.podWeightage * 100)}%`}
                      //   // value={`${(pod.podWeightage * 100)}%`}
                      //   value = {editedValue}
                      //   // onChange={(e) => handlePodWeightageChange(e.target.value, pod,index)}
                      //   onChange={(e) => setEditiedValue(e.target.value)}
                      //   className={styles.EditableInput}
                      // />
                      <input
                        type="text"
                        // defaultValue={`${(pod.podWeightage * 100)}%`}
                        //defaultValue={`${(podsData?.length === 1 ? 100 : pod?.podWeightage*100)}%`}
                        value={editedValues[pod._id]}
                        onChange={e =>
                          handlePodWeightageChange(e.target.value, pod, index)
                        }
                        className={styles.EditableInput}
                      />
                    ) : (
                      // Render a paragraph when podWeightageLock is false
                      // <p>{Math.round(pod.podWeightage * 100)}%</p>
                      <p>{editedValues[pod._id].toFixed(1)}%</p>
                    )}
                  </div>
                  <div className={styles.IconBox}>
                    {pod?.podWeightageLock ? (
                      <BiSolidLockAlt
                        onClick={() => handleLockOpen(pod)}></BiSolidLockAlt>
                    ) : (
                      <BiSolidLockOpen
                        onClick={() => handleLockClose(pod)}></BiSolidLockOpen>
                    )}
                  </div>
                </div>

                <div>{/* <BsThreeDotsVertical></BsThreeDotsVertical> */}</div>
              </div>
            </div>
          ) : null;
        })}

        <div
          className={styles.Common}
          style={{ gap: "4px" }}
          onClick={handleShowManagePods}>
          <AiOutlinePlus style={{ color: "var(--primary-100, #228276)" }}></AiOutlinePlus>
          <p style={{ cursor: "pointer" }}>Add a Pod</p>
        </div>
      </div>
    </>
  );
}

export default AddPodComponent;
