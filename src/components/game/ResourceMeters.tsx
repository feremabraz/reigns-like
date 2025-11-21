import { useAtomValue } from 'jotai';

import { PixelArtImage } from '@/components/game/PixelArtImage';

import { Badge } from '@/components/ui/primitives/badge';
import { ButtonGroup } from '@/components/ui/primitives/button-group';
import { Card, CardContent } from '@/components/ui/primitives/card';
import { Progress } from '@/components/ui/primitives/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/primitives/tooltip';
import { gameResourcesAtom } from '@/lib/store/game';

const resourceMeta = {
  church: {
    icon: '/ui/resource-clergy.png',
    label: 'Clergy',
    description: 'Faith, order, and spiritual influence.',
    progressVariant: 'church',
    accent: 'text-yellow-200 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]',
  },
  people: {
    icon: '/ui/resource-people.png',
    label: 'People',
    description: 'Public sentiment and morale.',
    progressVariant: 'people',
    accent: 'text-emerald-200 drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]',
  },
  army: {
    icon: '/ui/resource-military.png',
    label: 'Army',
    description: 'Military might and defense.',
    progressVariant: 'army',
    accent: 'text-red-200 drop-shadow-[0_0_4px_rgba(248,113,113,0.6)]',
  },
  wealth: {
    icon: '/ui/resource-monetary.png',
    label: 'Treasury',
    description: 'Royal coffers and trade.',
    progressVariant: 'wealth',
    accent: 'text-cyan-200 drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]',
  },
} as const;

export default function ResourceMeters() {
  const resources = useAtomValue(gameResourcesAtom);

  return (
    <TooltipProvider delayDuration={150}>
      <ButtonGroup className="justify-center" spacing="sm">
        {Object.entries(resources).map(([key, value]) => {
          const resourceKey = key as keyof typeof resourceMeta;
          const meta = resourceMeta[resourceKey];

          return (
            <Card
              key={key}
              className="relative w-28 border-white/10 bg-gradient-to-b from-gray-900/60 to-gray-950/90 px-3 py-2 shadow-[0_0_15px_rgba(0,0,0,0.35)]"
            >
              <CardContent className="flex flex-col items-center gap-2 p-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1">
                      <PixelArtImage
                        src={meta.icon}
                        alt={`${meta.label} resource`}
                        width={24}
                        height={24}
                      />
                      <Badge variant="default" className="text-[10px] px-2 py-0.5">
                        {meta.label}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{meta.description}</TooltipContent>
                </Tooltip>

                <div className="w-full">
                  <Progress variant={meta.progressVariant} value={value} />
                </div>

                <div className={`text-xs font-mono font-semibold ${meta.accent}`}>{value}</div>
              </CardContent>

              <div className="pointer-events-none absolute inset-0 rounded-lg border border-white/5 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
            </Card>
          );
        })}
      </ButtonGroup>
    </TooltipProvider>
  );
}
