import logoLeftLight from '../assets/shell/logo-black-red-left.webp';
import logoDomeLight from '../assets/shell/logo-black-red-dome.webp';
import logoRightLight from '../assets/shell/logo-black-red-right.webp';
import logoLeftDark from '../assets/shell/logo-white-green-left.webp';
import logoDomeDark from '../assets/shell/logo-white-green-dome.webp';
import logoRightDark from '../assets/shell/logo-white-green-right.webp';
import domeRed from '../assets/shell/dome-red.webp';
import domeGreen from '../assets/shell/dome-green.webp';
import peopleRed from '../assets/shell/people-red.webp';
import peopleGreen from '../assets/shell/people-green.webp';
import calendarRed from '../assets/shell/calendar-red.webp';
import calendarGreen from '../assets/shell/calendar-green.webp';

/** The wordmark in three slices ("halfd", the dome, "me") so the nav can fold it into the dome. */
export const LOGO = {
  left: { light: logoLeftLight, dark: logoLeftDark },
  dome: { light: logoDomeLight, dark: logoDomeDark },
  right: { light: logoRightLight, dark: logoRightDark },
};

export const DOME = { light: domeRed, dark: domeGreen };

export const NAV_ICONS = {
  people: { light: peopleRed, dark: peopleGreen },
  calendar: { light: calendarRed, dark: calendarGreen },
};
