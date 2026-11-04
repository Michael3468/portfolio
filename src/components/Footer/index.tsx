import gitHub from './icons/gitHub.svg';

import './styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <a
            className="footer__link"
            href="https://github.com/Michael3468"
            aria-label="Link to GitHub"
          >
            <img className="main-drop-shadow" src={gitHub} alt="link to github" />
          </a>
          <p className="footer__copyright-p main-text-shadow">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
