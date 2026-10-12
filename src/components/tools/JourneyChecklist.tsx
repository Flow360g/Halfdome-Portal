import { Link } from 'react-router-dom';
import arrow from '../../assets/brand/arrow-white-5.webp';
import { pagePath } from '../../content/hub';
import { journey } from '../../content/journey';
import { useJourneyProgress } from '../../lib/journey';

export function JourneyChecklist() {
  const progress = useJourneyProgress();
  const percent = Math.round((progress.count / progress.total) * 100);

  return (
    <section className="journey" aria-label="Your first 90 days checklist">
      <div className={progress.complete ? 'journey__progress is-complete' : 'journey__progress'}>
        <div className="journey__progress-text">
          <p className="tool__label">Your progress</p>
          <p className="journey__progress-count" role="status">
            {progress.complete ? 'You’re all set.' : `${progress.count} of ${progress.total} done`}
          </p>
          {progress.complete && (
            <p className="journey__progress-note">Ninety days in and fully settled. Welcome to Half Dome, properly.</p>
          )}
        </div>
        <div
          className="journey__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.count}
          aria-label="Steps completed"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        {progress.complete && <img className="journey__arrow hd-arrow" src={arrow} alt="" aria-hidden="true" width={56} height={78} />}
      </div>

      <ol className="journey__stages">
        {journey.map((stage) => {
          const stageDone = stage.steps.filter((s) => progress.done.includes(s.id)).length;
          return (
            <li key={stage.id} className="journey__stage">
              <div className="journey__stage-head">
                <h2 id={stage.id} className="journey__stage-title">
                  {stage.title}
                </h2>
                <p className="journey__stage-when">
                  {stage.when} · {stageDone} of {stage.steps.length}
                </p>
              </div>
              <ul className="journey__steps">
                {stage.steps.map((step) => {
                  const checked = progress.done.includes(step.id);
                  const inputId = `journey-${step.id}`;
                  return (
                    <li key={step.id} className={checked ? 'journey__step is-done' : 'journey__step'}>
                      <input
                        id={inputId}
                        type="checkbox"
                        className="journey__check"
                        checked={checked}
                        onChange={() => progress.toggle(step.id)}
                      />
                      <label htmlFor={inputId} className="journey__step-text">
                        <span className="journey__step-title">{step.title}</span>
                        <span className="journey__step-detail">{step.detail}</span>
                      </label>
                      {step.link && (
                        <Link className="journey__step-link" to={pagePath(step.link.topic, step.link.page)}>
                          Read<span className="visually-hidden"> about {step.title.toLowerCase()}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      {progress.started && (
        <button type="button" className="hd-btn hd-btn-quiet journey__reset" onClick={progress.reset}>
          Start again
        </button>
      )}
      <p className="tool__fineprint">Your ticks stay on this device. Nobody else can see them.</p>
    </section>
  );
}
