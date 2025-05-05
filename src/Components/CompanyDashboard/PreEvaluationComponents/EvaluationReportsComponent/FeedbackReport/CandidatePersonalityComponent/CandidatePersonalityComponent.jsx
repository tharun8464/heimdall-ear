import styles from "./CandidatePersonalityComponent.module.css";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import React, { useEffect, useState, } from "react";
import {
  getInterviewApplication,
} from "../../../../../../service/api";
import { getPsychDetails } from "../../../../../../service/api";
import { getStorage, getSessionStorage } from "../../../../../../service/storageService";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CandidatePersonalityComponent = ({ meetingLink, intId }) => {
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [psycsdetails, setpsycsdetails] = useState(null);
  const [persona, setpersona] = useState(null);
  const [proactiveness, setProactiveness] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [lAbility, setLability] = useState(0);
  const [stability, setStability] = useState(0);
  const [teamwork, setTeamwork] = useState(0);

  useEffect(() => {
    const gia = async () => {
      // let res = await getInterviewApplication({ id: meetingLink });
      let res = await getInterviewApplication({ id: intId });
      const { applicant, application } = res?.data?.data;
      setApplication(application);
      setApplicant(applicant);
      let psyResp = await getPsychDetails({ id: res?.data?.data?.application?.applicant });

      let psyscore = psyResp?.data?.data;
      setpsycsdetails(psyscore);

      let persona = psyResp?.data?.data?.persona;
      let proactiveness = Math.floor(persona?.details?.actionOrientedness?.score);
      setProactiveness(proactiveness);

      let attitude = Math.floor(persona?.details?.attitudeAndOutlook?.score);
      setAttitude(attitude);

      let lAbility = Math.floor(persona?.details?.learningAbility?.score);
      setLability(lAbility);

      let stability = Math.floor(persona?.details?.stabilityPotential?.score);
      setStability(stability);

      let teamwork = Math.floor(persona?.details?.teamWorkSkills?.score);
      setTeamwork(teamwork);
      setpersona(persona?.details);
    };

    const getuserdata = async () => {
      let user = JSON.parse(await getSessionStorage("user"));

      setUser(user);
      gia(user);
    };
    getuserdata();
  }, []);


  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.Heading}>Candidate Personality</h2>
      <div className={styles.RadarWrapper}>
        <Radar
          data={{
            labels: ["ProActiveness", "Attitude", "Learning ability", "Stability", "Teamwork",],
            datasets: [
              {
                label: "Scored",
                data: [proactiveness, attitude, lAbility, stability, teamwork],
                backgroundColor: "#2282761a",
                borderColor: "#228276",
                borderWidth: 3,
              }
            ],
          }}
          height={400}
          width={600}
          options={{
            indexAxis: "y",
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    steps: 1,
                    stepValue: 5,
                    max: 100
                  },
                },
              ],
              r: {
                min: 0,
                max: 10
              },
            },
            legend: {
              labels: {
                fontSize: 25,
              },
            },
          }}
        />
      </div>
      <div className={styles.TraitsWrapper}>
        {persona ? (
          <div>
            <p>Following traits are observed for <strong>{applicant && applicant.firstName}</strong>:</p>
            <ul>
              <li>The general behavior is <strong>{persona.generalBehavior?.level}</strong>.</li>
              <li>Has a <strong>{persona.needForAutonomy?.level}</strong> need for autonomy.</li>
              <li>The learning ability is <strong>{persona.learningAbility?.level}</strong>.</li>
              <li>The team work skills are <strong>{persona.teamWorkSkills?.level}</strong>.</li>
              <li>Has a <strong>{persona.attitudeAndOutlook?.level}</strong> attitude and outlook.</li>
              {/* <li>Action-orientedness is <strong>{persona.actionOrientedness?.level}</strong>.</li> */}
            </ul>
          </div>
        ) : (
          <strong>No personality assessment found for the candidate.</strong>
        )}
      </div>
    </div>
  );
};

export default CandidatePersonalityComponent;
