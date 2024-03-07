import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Socials = () => {
  return (
    <div className="socials">
      <a
        href="https://www.instagram.com/kreivaxalfaaz/"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a
        href="https://www.instagram.com/kreivaxalfaaz/"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faXTwitter} />
      </a>
      <a
        href="https://www.instagram.com/kreivaxalfaaz/"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faFacebook} />
      </a>
    </div>
  );
};

export default Socials;