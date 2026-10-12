import { JOURNEY_STORAGE_KEY, journeySteps } from '../content/journey';
import { useStoredState } from './storage';

/** Which journey steps this person has ticked off, saved on this device. */
export function useJourneyProgress() {
  const [done, setDone] = useStoredState<string[]>(JOURNEY_STORAGE_KEY, []);
  const valid = done.filter((id) => journeySteps.some((step) => step.id === id));

  function toggle(id: string) {
    setDone(valid.includes(id) ? valid.filter((d) => d !== id) : [...valid, id]);
  }

  return {
    done: valid,
    toggle,
    reset: () => setDone([]),
    count: valid.length,
    total: journeySteps.length,
    started: valid.length > 0,
    complete: valid.length === journeySteps.length,
  };
}
