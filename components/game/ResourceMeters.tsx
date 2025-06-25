import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { gameResourcesAtom } from '@/lib/store/game';

const resourceIcons = {
  church: '/ui/resource-clergy.png',
  people: '/ui/resource-people.png',
  army: '/ui/resource-military.png',
  wealth: '/ui/resource-monetary.png',
};

const resourceColors = {
  church: '#FFD700',
  people: '#00FF00',
  army: '#FF6B6B',
  wealth: '#00BFFF',
};

const meterSegments = Array.from({ length: 5 }, (_, i) => ({ id: i }));

export default function ResourceMeters() {
  const resources = useAtomValue(gameResourcesAtom);

  return (
    <div className="flex justify-center items-center gap-4 p-2">
      {Object.entries(resources).map(([key, value]) => {
        const resourceKey = key as keyof typeof resources;
        const resourceColor = resourceColors[resourceKey];

        return (
          <div
            key={key}
            className="bg-gradient-to-b from-green-900 to-green-950 p-2 rounded border border-gray-800 relative overflow-hidden shadow-md flex flex-row items-center gap-2"
          >
            {/* Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-800/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded" />

            {/* Icon */}
            <Image
              src={resourceIcons[resourceKey]}
              alt={`${resourceKey} resource`}
              width={16}
              height={16}
              style={{
                filter: `drop-shadow(0 0 2px ${resourceColor})`,
              }}
            />

            {/* Meter */}
            <div className="flex flex-row gap-px h-2">
              {meterSegments.map((segment) => {
                const isFilled = segment.id < Math.floor((value / 100) * 5);
                return (
                  <div
                    key={`${key}-segment-${segment.id}`}
                    className="h-full w-2 rounded-sm"
                    style={{
                      backgroundColor: isFilled ? resourceColor : '#1a1a1a',
                      boxShadow: isFilled ? `inset 0 0 1px ${resourceColor}` : 'inset 0 0 1px #000',
                      opacity: isFilled ? 1 : 0.3,
                    }}
                  />
                );
              })}
            </div>

            {/* Value */}
            <div
              className="text-center text-xs font-mono font-bold tracking-wide w-6"
              style={{ color: resourceColor }}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
