import {
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@nonogram-api-monorepo/ui';
import React from 'react';

type Props = {
  setIsDisplayAllNonograms: (isDisplayAllNonograms: boolean) => void;
  isDisplayAllNonograms: boolean;
};

export const NonogramListHeader: React.FC<Props> = ({
  setIsDisplayAllNonograms,
  isDisplayAllNonograms,
}) => {
  return (
    <div className="w-full">
      <Tabs
        defaultValue={isDisplayAllNonograms}
        value={isDisplayAllNonograms}
        onValueChange={(value) => {
          setIsDisplayAllNonograms(value);
        }}
        className="w-full mb-2"
        asChild
      >
        <TabsList className="flex flex-row">
          <TabsTrigger value={true}>All</TabsTrigger>
          <TabsTrigger value={false}>Unplayed</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/40 mb-2 text-sm md:text-lg">
        <span className="font-bold text-center">Nonogram Name</span>
        <Separator orientation="vertical" className="w-full h-full" />
        <span className="font-semibold text-center">Creator Name</span>
        <Separator orientation="vertical" className="w-full h-full" />
        <span className="text-center" role="img" aria-label="size emoji">
          📐 Size
        </span>
        <Separator orientation="vertical" className="w-full h-full" />
        <span className="text-center" role="img" aria-label="like emoji">
          👍 Like count
        </span>
        <Separator orientation="vertical" className="w-full h-full" />
        <span className="text-center" role="img" aria-label="joystick emoji">
          🎮 Player count
        </span>
      </div>
    </div>
  );
};
