import PercentageComponent from "../../PercentageComponent/PercentageComponent";
import styles from "./CompetitorMatch.module.css";
import logo1 from "../../../../../../assets/images/logo1.png";
import { useSelector } from "react-redux";
import office_avatar from "../../../../../../assets/images/officeavatar.png";
import { useEffect, useState } from "react";
import useReport from "../../../../../../Hooks/useReport";
const url = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;

const CompetitorMatch = ({ competitors, selectedCandidate, isMainView, organizationID }) => {
  // console.log("compitators", selectedCandidate)
  const { heimdallToken } = useSelector((state) => state.baselining);
  const [cultureMatches, setCultureMatches] = useState([]);

  useEffect(() => {
    const fetchCultureMatches = async () => {


      const updatedCultureMatches = await Promise.all(
        competitors.map(async ({ companyName, companyImage }) => {
          const apiUrl = `${url}/company/culture/match`;
          // const apiUrl = `${url}/aggregation/culturematch`;
          const headers = {
            "Authorization": `Bearer ${heimdallToken?.token}`,
            "client-id": process.env.REACT_APP_DS_CLIENT_ID,
            "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
            "Content-Type": "application/json",
          };
          // const body = {
          //   OrganizationName: companyName,
          //   CandidateProfileId: isMainView
          //     ? selectedCandidate?.indiProfileId
          //     : selectedCandidate?.mProfileId,
          // };
          const body = {
            organizationID: organizationID,
            profileID: isMainView
              ? selectedCandidate?.indiProfileId
              : selectedCandidate?.mProfileId,
          };

          try {
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(body),
            });
            if (response.status === 200) {
              const data = await response.json();
              return { companyName, companyImage, percentage: Math.round(data?.data?.conf * 100) }; // Assuming the API response has a 'percentage' field
            } else {
              // console.error(`Failed to fetch data for ${companyName}`);
              return { companyName, companyImage, percentage: 0 }; // Set a default value or handle error as needed
            }
          } catch (error) {
            // console.error(`Error while fetching data for ${companyName}`, error);
            return { companyName, companyImage, percentage: 0 }; // Set a default value or handle error as needed
          }
        })
      );

      setCultureMatches(updatedCultureMatches);
      // console.log("update", cultureMatches)
    };

    fetchCultureMatches();
  }, [competitors, selectedCandidate]);



  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.Heading}>Competitor Match</h2>
      <div className={styles.ContentWrapper}>
        {cultureMatches.map(({ companyName, percentage, companyImage }) => (

          <PercentageComponent key={companyName} logoSrc={companyImage ? companyImage : office_avatar} title={companyName}
            percentage={percentage}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetitorMatch;
