import React from "react";
import { Close } from "@material-ui/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../Button/Button";
import CustomInput from "../../CustomInput/CustomInput";
import styles from "./ManagePodComponent.module.css";
import PodCard from "./PodCard/PodCard";
import usePod from "../../../Hooks/usePod";
import { useEffect } from "react";


const ManagePodComponent = ({
  setShowManagePodsPopup,
  jobId,
  setPodsData,
  handleCreatePod,
  allPods,
  setSelectedPods,
}) => {
  const [podData, setPodData] = useState([]);
  const [filteredPod, setFilteredPod] = useState([]);
  let [searchFlag, setSearchFlag] = useState(false);
  const [pods, setPods] = useState([{}]);
  const [selectedPod, setSelectedPod] = useState(null);
  const { handleGetAllPods, handleGetPodsByCompanyId, handleSelectCreatePod } = usePod();
  const { allPodsData } = useSelector(state => state.pod);


  const [searchedPod, setSearchedPod] = useState();

  useEffect(() => {
    let data = {};
    for (let item of allPods) {
      data[item?._id] = item?.isSelected;
    }

    setSelectedPod(data);
  }, []);

  useEffect(() => {
    const initial = async () => {
      await handleGetAllPods(jobId);
      //let user = JSON.parse(await getSessionStorage("user"));
      setPodData(allPodsData);
      setFilteredPod(allPodsData);
    };
    initial();
  }, []);

  useEffect(() => {
    setPodData(allPodsData);
    setFilteredPod(allPodsData);
  }, [allPodsData])

  const handleChange = event => {
    const { name, value } = event.target;
  };

  const handleClose = () => {
    setShowManagePodsPopup(false);
  };

  const handleSubmit = async () => {
    let data = [];
    let data1 = [];
    for (let [key, value] of Object.entries(selectedPod)) {
      data.push(value);
      data1.push(key);
    }
    const res = await handleSelectCreatePod(jobId, data1);

    const filteredData = res?.data.filter(value => data1.includes(value?._id));

    if (res) {
      setPodsData(filteredData.length !== 0 ? filteredData : allPodsData);

      setSelectedPods(filteredData.length !== 0 ? filteredData : allPodsData);
      setShowManagePodsPopup(false);
    }
  };

  const handleFilter = async filterValue => {
    const lowercasedFilterValue = filterValue.trim().toLowerCase();
    let filteredPod;
    if (!lowercasedFilterValue) {
      setSearchFlag(false);
      filteredPod = podData;
    } else {
      setSearchFlag(true);
      filteredPod = podData?.filter(pod => {
        const name = pod.name && pod.name.toLowerCase().includes(lowercasedFilterValue);
        return name;
      });
    }

    setSearchedPod(filteredPod);
  };

  const togglePods = value => {
    if (selectedPod[value._id]) {
      let data = { ...selectedPod };
      delete data[value._id];
      setSelectedPod(data);
    } else {
      setSelectedPod({ ...selectedPod, [value._id]: true });
    }
  };

  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.HeadingWrapper}>
          <h2 className={styles.Heading}>
            Manage pods{" "}
            <span className="text-gray-400 font-100 ">
              {" "}
              <span className={styles.Dot}>.</span> {podData?.length}
            </span>{" "}
          </h2>
          <Close className={styles.Close} onClick={handleClose} />
        </div>
        <div>
          <div className={styles.InputWrapper}>
            <div className={styles.CreatePodTextWrapper}>
              <span className={styles.Subheading}>Select a pod</span>
              <span className={styles.CreatePod} onClick={handleCreatePod}>
                + Create pod
              </span>
            </div>
            <div className={styles.inputIcons}>
              <i className={`fa fa-search ${styles.icon}`}></i>
              <CustomInput
                placeholder={"Search"}
                className={styles.inputField}
                onChange={e => handleFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.PodCardWrapper}>
          {!searchedPod
            ? filteredPod?.map((podData, index) => {
              return (
                <React.Fragment key={index}>
                  <PodCard
                    {...podData}
                    togglePods={togglePods}
                    index={index}
                    selectedPod={selectedPod}
                    jobId={jobId}
                  />
                </React.Fragment>
              );
            })
            : searchedPod?.map((podData, index) => {
              return (
                <React.Fragment key={index}>
                  <PodCard
                    {...podData}
                    togglePods={togglePods}
                    index={index}
                    selectedPod={selectedPod}
                    jobId={jobId}
                  />
                </React.Fragment>
              );
            })}
        </div>

        <div className={styles.BottomBtnsWrapper}>
          <Button
            text={"Save"}
            btnType={"primary"}
            className={styles.BtnClass}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default ManagePodComponent;
