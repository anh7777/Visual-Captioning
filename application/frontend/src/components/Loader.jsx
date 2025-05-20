import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

function Loader() {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    return (
        <div className={`flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 ${isDarkMode ? 'bg-[#20262E]' : 'bg-white'}`}>
            <FontAwesomeIcon icon={faComputer} color={isDarkMode ? 'white' : 'black'} size="3x"/>
        </div>
    );
}

export default Loader;