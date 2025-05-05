import { useEffect, useState } from 'react';
import styles from './DefineWeightageComponent.module.css';
import { BiSolidLockAlt, BiSolidLockOpen, BiSolidLockOpenAlt } from 'react-icons/bi';
import Loader from '../../Loader/Loader';
import { getCanCompBalance } from '../../../service/api';
import { notify } from '../../../utils/notify';
import useTeamCompatibility from '../../../Hooks/useTeamCompatibility';

const DefineWeightageComponent = ({ candidatesData }) => {

    // Candidate balance and compatibility states
    const [balance, setBalance] = useState(null)
    const [comp, setComp] = useState(null)
    const [showBalanceTextbox, setShowBalanceText]=useState(false);
    const [showCompTextbox,setShowCompText]=useState(false);

    useEffect(() => {
        const initial = async () => {
            let candidateLinkedinUrl = candidatesData?.profileURL
            let res = await getCanCompBalance(candidateLinkedinUrl)
            setBalance(res?.data?.balance ? res?.data?.balance : 50)
            setComp(res?.data?.compatibility ? res?.data?.compatibility : 50)
            setShowBalanceText(true);
            setShowCompText(true);
        }
        initial()
    }, [])

    let candidateLinkedinUrl = candidatesData?.profileURL

    const { getCandidateEval } = useTeamCompatibility()

    // const [balanceW,setBalanceW] = useState(50);
    const [balanceW, setBalanceW] = useState((balance !== null ? balance : 50));
    // const [compatibilityW,setCompatibilityW] = useState(50);
    const [compatibilityW, setCompatibilityW] = useState((comp !== null ? comp : 50));

    const [balanceLockToggle, setBalanceToggleLock] = useState(false)
    const [compatibilityLockToggle, setCompatibilityToggleLock] = useState(false)

    const updateBalanceW = (value) => {
        // setBalanceW(value);        
        setBalance(value);
    }

    const updateCompatibilityW = (value) => {
        // setCompatibilityW(value);

        setComp(value)
    }

    // If the lock is closed then it should just open
    const handleBalanceLock2 = () => {
        setBalanceToggleLock(!balanceLockToggle)
    }

    // If the lock is open then it should close and the value should be sent to backend and saved in db
    const handleBalanceLock1 = async () => {        
        if (balance<= 100) {
            let data = {
                linkedinurl: candidateLinkedinUrl,
                balance:balance,
                comp:100-balance
            }
            let res = await getCandidateEval(data)            
            if (res) {
                setComp(res?.compatibility);                
                notify("Balance updated successfully!", 'sucsess');
                setBalanceToggleLock(true);
            }

        } else {
            notify("Balance and compatibility's total shouldn't be greater than 100!", 'error');
        }
    }

    // If the lock is open then it should close and the value should be sent to backend and saved in db
    const handleCompatibilityLock1 = async () => {
        // let data = {
        //     linkedinurl: candidateLinkedinUrl,
        //     // balanceW,
        //     // compatibilityW
        //     balance,
        //     comp
        // }        
        if (comp <= 100) {            
            let data = {
                linkedinurl: candidateLinkedinUrl,
                balance:100-comp,
                comp:comp
            }
            let res = await getCandidateEval(data)            
            if (res) {
                setBalance(res?.balance);               
                notify("Compatibility updated successfully!", 'sucsess');
                setCompatibilityToggleLock(true)
            }
        } else {
            notify("Compatibility and balance's total shouldn't be greater than 100!", 'error');
        }
    }

    // If the lock is closed then it should just open
    const handleCompatibilityLock2 = () => {
        setCompatibilityToggleLock(!compatibilityLockToggle)
    }


    return (
        <div className={styles.frameParent}>
            <div className={styles.balanceParent}>
                <div className={styles.balance}>Balance</div>
                <div className={styles.frameGroup}>
                    <div className={styles.frameWrapper}>
                        <div className={styles.SideCont}>
                            <div style={{ display: "flex" }}>
                                <div className={styles.PercentBox}>
                                    {showBalanceTextbox ? (
                                        <input disabled={balanceLockToggle === true ? true : false} type="text" value={`${balance}`} onChange={(e) => { updateBalanceW(e.target.value) }} className={styles.EditableInput} />
                                    ) : (
                                        // Render a paragraph when podWeightageLock is false
                                        <Loader />
                                        // <p>{Math.round(pod.podWeightage * 100)}%</p>
                                    )}
                                </div>
                                <div className={styles.PercentSymbol}>%</div>
                                <div className={styles.IconBox}>
                                    {/* {pod.podWeightageLock ?
                                        <BiSolidLockAlt></BiSolidLockAlt>
                                        : */}
                                    {
                                        balanceLockToggle === false ? (
                                            <BiSolidLockOpen onClick={handleBalanceLock1}></BiSolidLockOpen>                 
                                           ) : (
                                            <BiSolidLockAlt onClick={handleBalanceLock2}></BiSolidLockAlt>
                                        )
                                    }
                                    {/* } */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.frameDiv}>
                        <div className={styles.frameWrapper1}>
                            <div className={styles.ellipseParent}>
                                <div className={styles.frameChild} />
                                <div className={styles.frameItem} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.balanceParent}>
                <div className={styles.balance}>Compatibility</div>
                <div className={styles.frameGroup}>
                    <div className={styles.frameWrapper}>
                        <div className={styles.SideCont}>
                            <div style={{ display: "flex" }}>
                                <div className={styles.PercentBox}>
                                    {showCompTextbox ?
                                        <input
                                            disabled={compatibilityLockToggle === true ? true : false}
                                            type="text"
                                            value={comp}
                                            onChange={(e) => updateCompatibilityW(e.target.value)}
                                            className={styles.EditableInput}
                                        /> : <Loader />}
                                </div>
                                <div className={styles.PercentSymbol}>%</div>
                                {/* {!pod.podWeightageLock ? ( */}
                                {/* <input type="text" value={`${compatibilityW}%`} onChange={(e) => {updateCompatibilityW(e.target.value)}}className={styles.EditableInput}/> */}
                                {/* ) : (
                                        // Render a paragraph when podWeightageLock is false
                                        <p>{Math.round(pod.podWeightage * 100)}%</p>
                                    )} */}

                                <div className={styles.IconBox}>
                                    {/* {pod.podWeightageLock ?
                                        <BiSolidLockAlt></BiSolidLockAlt>
                                        : */}
                                    {
                                        compatibilityLockToggle === false ? (
                                            <BiSolidLockOpen onClick={handleCompatibilityLock1} ></BiSolidLockOpen>
                                        ) : (
                                            <BiSolidLockAlt onClick={handleCompatibilityLock2} ></BiSolidLockAlt>
                                        )
                                    }
                                    {/* } */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.frameDiv}>
                        <div className={styles.frameWrapper1}>
                            <div className={styles.ellipseParent}>
                                <div className={styles.frameChild} />
                                <div className={styles.frameItem} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default DefineWeightageComponent;
