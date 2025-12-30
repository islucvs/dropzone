'use client';

export function ControlsHelp() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Controls</h3>
      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Drag & Drop</span>
          <span className="text-gray-300">Deploy Units</span>
        </div>
        <div className="flex justify-between">
          <span>Click</span>
          <span className="text-gray-300">Move Selected</span>
        </div>
        <div className="flex justify-between">
          <span>Ctrl + Click</span>
          <span className="text-gray-300">Multi-Select</span>
        </div>
        <div className="flex justify-between">
          <span>Middle Click Drag</span>
          <span className="text-gray-300">Pan Map</span>
        </div>
        <div className="flex justify-between">
          <span>Scroll</span>
          <span className="text-gray-300">Zoom</span>
        </div>
        <div className="flex justify-between">
          <span>S</span>
          <span className="text-gray-300">Stop Units</span>
        </div>
        <div className="flex justify-between">
          <span>ESC</span>
          <span className="text-gray-300">Deselect</span>
        </div>
      </div>
    </div>
  );
}
