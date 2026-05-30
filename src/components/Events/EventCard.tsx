import type { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
  isActive: boolean;
  imgSrc: string;
  delay: string;
  onReserve: () => void;
  onBookVIP: () => void; // <-- NEW PROP
}

export function EventCard({ event, isActive, imgSrc, delay, onReserve, onBookVIP }: EventCardProps) {
  return (
    <div
      className="group flex flex-col"
      style={{ transitionDelay: delay }}
    >
      <div className="w-full aspect-[3/4] overflow-hidden bg-brand-offwhite mb-6 relative">
        {/* Sold out overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-brand-black/20 z-10" />
        )}

        {/* Badges */}
        {event.badge && (
          <div className={`absolute ${isActive ? 'top-4 left-4 bg-brand-accent text-white px-3 py-1.5' : 'inset-0 flex items-center justify-center'} z-20`}>
            <span className={`${!isActive ? 'bg-brand-black text-brand-white px-4 py-2' : ''} text-[10px] uppercase font-bold tracking-[0.2em]`}>
              {String(event.badge)}
            </span>
          </div>
        )}

        <img
          src={imgSrc}
          alt={event.basicInfo?.name ?? 'Event'}
          className={`w-full h-full object-cover filter transition-all duration-[300ms] ease-custom ${
            isActive ? 'grayscale group-hover:grayscale-0 group-hover:scale-105' : 'grayscale opacity-70'
          }`}
        />
      </div>

      <div className={`flex flex-col flex-1 ${!isActive ? 'opacity-60' : ''}`}>
        <h3 className={`text-2xl font-display font-bold uppercase tracking-tighter mb-2 text-wrap ${!isActive ? 'text-brand-gray' : ''}`}>
          {event.basicInfo?.name}
        </h3>
        <p className={`text-xs font-bold tracking-[0.15em] uppercase mb-1 ${isActive ? 'text-brand-black' : 'text-brand-gray'}`}>
          {event.basicInfo?.date
            ? new Date(event.basicInfo.date).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '—'}
        </p>
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-gray mb-4">
          {event.basicInfo?.city ?? event.basicInfo?.location}
        </p>
        <p className={`text-sm font-medium mb-6 flex-1 ${isActive ? 'text-brand-black' : 'text-brand-gray'}`}>
          {event.basicInfo?.venue}
        </p>

        {isActive ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={onReserve}
              className="relative inline-flex items-center justify-center w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center bg-brand-black text-white hover:bg-gray-800 transition-all duration-300"
            >
              Reserve Tickets
            </button>
            <button
              onClick={onBookVIP}
              className="relative inline-flex items-center justify-center w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center bg-transparent text-brand-black border border-brand-black hover:bg-brand-offwhite transition-all duration-300"
            >
              Book VIP
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase text-center bg-brand-offwhite text-brand-gray cursor-not-allowed mt-auto"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}