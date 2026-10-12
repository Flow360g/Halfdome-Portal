import type { StreamId } from '../content/agencyCalendar';

export function StreamDot({ stream, size = 10 }: { stream: StreamId; size?: number }) {
  return <span className="dot" data-stream={stream} style={{ width: size, height: size }} aria-hidden="true" />;
}
