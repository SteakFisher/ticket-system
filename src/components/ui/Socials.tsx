import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const Socials = () => {
  return (
    <div className="socials">
      <a
        href="https://www.instagram.com/academics_committee_iiitv/"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a
        href="mailto:academics_committee@iiitvadodara.ac.in"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </a>
      <a
        href="tel:+91 6367019081"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faPhone} />
      </a>
    </div>
  );
};

export default Socials;