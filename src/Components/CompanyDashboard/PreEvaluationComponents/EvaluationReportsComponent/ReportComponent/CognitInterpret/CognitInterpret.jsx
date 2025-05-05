import React from 'react'
import styles from "../CognitiveAnalysis/CognitiveAnalysis.module.css";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import TextAndChipComponent from "../GeneralInsightComponent/TextAndChipComponent/TextAndChipComponent";
import { ArrowCircleDown } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";

function CognitInterpret({ narrat }) {
    const strengthItems = [
        { title: 'Mohit sometimes thinks abstractly, reason quickly and problem solve independent of any previously acquired knowledge.' },
        { title: 'Mohit has a high ability to convey and express ideas, feelings and emotions effectively.' },
        { title: 'He has very high ability to resolve complex problems effectively and efficiently. ' },
        // Add more items as needed
    ];

    const strengthByHighestScore = narrat;

   

    const strengthItem = strengthByHighestScore?.narrations.map(
        (narrations, index) => ({
            title: narrations,
            
        })
    );
    return (
        <div className={styles.ADwrapper}>


            <div className={styles.BottomSection}>
                <div className={styles.HeadingWrapper}>
                    <h2 className={styles.Heading}>Cognition Interpretation</h2>

                </div>
                <div className={styles.ContentWrapper}>
                    {strengthItem?.map(({ title, chipText }) => (
                        <TextAndChipComponent
                            title={title}
                            chipText={chipText}
                            chipType="success"
                        />
                    ))}
                </div>


            </div>
        </div>
    )
}

export default CognitInterpret