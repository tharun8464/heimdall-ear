import { useState } from 'react';
import PlaygroundComponent from '../../../Components/UserDashboard/PlaygroundComponent/PlaygroundComponent';
import usePopup from '../../../Hooks/usePopup';
const Playground = () => {
    const [showPlayground, setShowPlayground] = useState(false)

    const handleShowPlayground = () => {
        setShowPlayground(true)
    }

    return (
        <div className={""}>
            {showPlayground ? <PlaygroundComponent setShowPlayground={setShowPlayground} /> : null}
            <button onClick={handleShowPlayground}>Open</button>
        </div>
    );
};

export default Playground;
