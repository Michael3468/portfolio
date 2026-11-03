import gitHub from './icons/gitHub.svg';
import instagram from './icons/instagram.svg';
import linkedIn from './icons/linkedIn.svg';
import twitter from './icons/twitter.svg';
import vk from './icons/vk.svg';

import './styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wrapper d-flex flex-row">
          <ul className="footer__social">
            <li className="footer__social-item">
              <a href="https://github.com/Michael3468" aria-label="Link to VK">
                <img className="main-drop-shadow" src={vk} alt="link to vk" />
              </a>
            </li>
            <li className="footer__social-item">
              <a href="https://github.com/Michael3468" aria-label="Link to Instagram">
                <img className="main-drop-shadow" src={instagram} alt="link to instagram" />
              </a>
            </li>
            <li className="footer__social-item">
              <a href="https://github.com/Michael3468" aria-label="Link to Twitter">
                <img className="main-drop-shadow" src={twitter} alt="link to twitter" />
              </a>
            </li>
            <li className="footer__social-item">
              <a href="https://github.com/Michael3468" aria-label="Link to GitHub">
                <img className="main-drop-shadow" src={gitHub} alt="link to github" />
              </a>
            </li>
            <li className="footer__social-item">
              <a href="https://github.com/Michael3468" aria-label="Link to LinkedIn">
                <img className="main-drop-shadow" src={linkedIn} alt="link to linkedin" />
              </a>
            </li>
          </ul>
          <div className="footer__copyright">
            <p className="footer__copyright-p main-text-shadow">© 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
