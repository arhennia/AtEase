import React from 'react';
import UnicornScene from 'unicornstudio-react';

const PROJECT_ID = 'M2N0rRDMdm5MA8kykahd';

export function UnicornBackground({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <UnicornScene
        projectId={PROJECT_ID}
        width="100%"
        height="100%"
        production={true}
        lazyLoad={true}
        dpi={1.5}
        fps={60}
      />
    </div>
  );
}

export default UnicornBackground;
