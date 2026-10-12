import { Link } from 'react-router-dom';
import { Logo } from './brand/Logo';
import { Tagline } from './brand/Tagline';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <section className="site-footer__help" aria-labelledby="help-title">
          <h2 id="help-title" className="hd-h2">
            Can’t find what you need?
          </h2>
          <p className="site-footer__help-body">
            The People and Culture team is here for questions big and small, from your first payslip to a tricky
            conversation.
          </p>
          <Link to="/topics/our-team/who-to-ask-for-what" className="hd-btn hd-btn-primary">
            Ask People and Culture
          </Link>
        </section>

        <div className="site-footer__base">
          <Logo height={22} />
          <p className="site-footer__acknowledgement">
            Half Dome acknowledges the Wurundjeri Woi-wurrung people of the Kulin Nation, the Traditional Custodians
            of the land on which we work in Richmond. We pay our respects to their Elders past and present.
          </p>
          <p className="site-footer__meta">© {new Date().getFullYear()} Half Dome. For Half Domers only.</p>
        </div>

        <Tagline height={208} className="site-footer__tagline" />
      </div>
    </footer>
  );
}
