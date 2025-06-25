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

export default function ResourceMeters() {
  const resources = useAtomValue(gameResourcesAtom);

  return (
    <div className="flex justify-center items-center gap-3 p-2">
      {Object.entries(resources).map(([key, value]) => {
        const resourceKey = key as keyof typeof resources;
        const resourceColor = resourceColors[resourceKey];

        return (
          <div key={key} className="relative">
            {/* Compact GBA-style LCD display */}
            <div className="bg-gradient-to-b from-green-900 to-green-950 p-2 rounded border border-gray-800 relative overflow-hidden min-w-[50px] shadow-md">
              {/* LCD scanlines effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-800/20 to-transparent pointer-events-none" />

              {/* Resource icon */}
              <div className="text-center mb-2 flex justify-center items-center h-4">
                <Image
                  src={resourceIcons[resourceKey]}
                  alt={`${resourceKey} resource`}
                  width={16}
                  height={16}
                  className="pixelated"
                  style={{
                    imageRendering: 'pixelated',
                    filter: `drop-shadow(0 0 2px ${resourceColor})`,
                  }}
                />
              </div>

              {/* Compact segmented meter display */}
              <div className="flex flex-col gap-px">
                {Array.from({ length: 5 }, (_, i) => {
                  const segmentIndex = 4 - i; // Reverse order for top-to-bottom filling
                  const isFilled = segmentIndex < Math.floor((value / 100) * 5);

                  return (
                    <div
                      key={segmentIndex}
                      className="h-1 w-full rounded-sm"
                      style={{
                        backgroundColor: isFilled ? resourceColor : '#1a1a1a',
                        boxShadow: isFilled
                          ? `inset 0 0 1px ${resourceColor}`
                          : 'inset 0 0 1px #000',
                        opacity: isFilled ? 1 : 0.3,
                      }}
                    />
                  );
                })}
              </div>

              {/* Compact numeric display */}
              <div
                className="text-center mt-1 text-xs font-mono font-bold tracking-wide"
                style={{ color: resourceColor }}
              >
                {value}
              </div>

              {/* LCD glare effect */}
              <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
