import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function Loader() {
    return (
        <div className='flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-white'>
            <FontAwesomeIcon icon={faComputer} color='black' size="3x"/>
        </div>
    );
}

export default Loader;