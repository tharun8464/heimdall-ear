import styles from "./candidateListingTable.module.css";
import { AiFillCaretDown } from "react-icons/ai";
import { IoCaretUpSharp } from "react-icons/io5";
// import placeholderAvatar from "../../../assets/sharedReports/placeholderAvatar.svg";
import placeholderAvatar from "../../../../assets/images/vm_user_placeholder.png"
import { Checkbox } from "@mui/material";
import CustomChip from "../../../CustomChip/CustomChip";
import SharedReportsTableHeader from "../sharedReportsTableHeader/sharedReportsTableHeader";

const CandidateListingTable = () => {

  const reports = [1, 2, 3, 4];
  return (
    <div className="w-full mt-6">
      <SharedReportsTableHeader />
      <table className="mx-auto w-full max-w-6xl bg-white rounded-lg">
        <thead className="bg-white border-b">
          <tr className={`w-[100%] bg-[#F1F1F1] `}>
            <th>
              <Checkbox />
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-[#888888]"
              style={{ cursor: "pointer" }}>
              <div className="flex flex-row gap-2 items-center">
                <div>
                  <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                  <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                </div>
                <div>Name</div>
              </div>
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-[#888888]"
              style={{ cursor: "pointer" }}>
              <div className="flex flex-row gap-2 items-center">
                <div>
                  <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                  <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                </div>
                <div className={styles.HeadingText}> Product Designer</div>
              </div>
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-[#888888] "
              style={{ cursor: "pointer" }}>
              <div className="flex flex-row gap-2 items-center">
                <div>
                  <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                  <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                </div>
                <div className={styles.HeadingText}> Product Manager</div>
              </div>
            </th>
            <th
              className="text-sm font-medium text-[#888888]"
              style={{ cursor: "pointer" }}>
              <div className="flex flex-row gap-2 items-center">
                <div>
                  <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                  <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                </div>
                <div className={""}> SDE III</div>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reports.map(item => {
            return (
              <tr className="" key={item}>
                <td>
                  <Checkbox />
                </td>
                <td>
                  <div className="flex gap-4 w-full">
                    <img src={placeholderAvatar} alt="" className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <span>Himanshu kumar</span>
                      <span className="text-[#33333380]">Web Developer</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
                    <div>
                      <CustomChip label={"High"} type="high-talent" />
                    </div>
                    <div className="flex gap-4">
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
                    <div>
                      <CustomChip label={"High"} type="medium-talent" />
                    </div>
                    <div className="flex gap-4">
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-4">
                    <div>
                      <CustomChip label={"High"} type="low-talent" />
                    </div>
                    <div className="flex gap-4">
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                      <CustomChip label={"vm lite"} type="regular" customClass={'!h-[26px]'} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateListingTable;
