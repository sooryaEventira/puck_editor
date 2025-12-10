import React, { useState, useCallback } from "react";
import { PageData } from "../../types";
import { config } from "../../config/puckConfig";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface PreviewProps {
  data: PageData;
  isInteractive?: boolean;
  onDataChange?: (newData: PageData) => void;
}

const Preview: React.FC<PreviewProps> = ({ data, isInteractive = false, onDataChange }) => {
  const [localData, setLocalData] = useState<PageData>(data);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<{componentId: string, columnIndex: number} | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<{componentId: string, columnIndex: number} | null>(null);

  // Update local data when props change
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, item: any, sourceZone: string) => {
    if (!isInteractive) {
      return;
    }
    
    setDraggedItem({ ...item, sourceZone, componentId: item.componentId });
    e.dataTransfer.effectAllowed = 'move';
  }, [isInteractive]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, targetZone: string) => {
    if (!isInteractive) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(targetZone);
  }, [isInteractive]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, targetZone: string) => {
    if (!isInteractive || !draggedItem || !onDataChange) return;
    
    e.preventDefault();
    
    const newData = { ...localData };
    const componentId = draggedItem.componentId;
    const sourceZone = draggedItem.sourceZone;
    
    // Find the component
    const componentIndex = newData.content.findIndex((item: any) => item.props?.id === componentId);
    if (componentIndex === -1) {
      return;
    }
    
    // Update zones
    const sourceZoneKey = `${componentId}:${sourceZone}`;
    const targetZoneKey = `${componentId}:${targetZone}`;
    
    if (newData.zones[sourceZoneKey] && newData.zones[targetZoneKey]) {
      // Find the item to move by matching the dragged item data
      const sourceItems = newData.zones[sourceZoneKey];
      const itemIndex = sourceItems.findIndex((item: any) => 
        item.type === draggedItem.type && 
        JSON.stringify(item.props) === JSON.stringify(draggedItem.props)
      );
      
      if (itemIndex !== -1) {
        // Remove from source zone
        const [movedItem] = sourceItems.splice(itemIndex, 1);
        newData.zones[sourceZoneKey] = sourceItems;
        
        // Add to target zone
        newData.zones[targetZoneKey] = [...newData.zones[targetZoneKey], movedItem];
        
        setLocalData(newData);
        onDataChange(newData);
      }
    }
    
    setDraggedItem(null);
    setDragOverZone(null);
  }, [isInteractive, draggedItem, onDataChange, localData]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverZone(null);
  }, []);

  // Handle column drag start
  const handleColumnDragStart = useCallback((e: React.DragEvent, componentId: string, columnIndex: number) => {
    if (!isInteractive) return;
    
    setDraggedColumn({ componentId, columnIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `column-${componentId}-${columnIndex}`);
  }, [isInteractive]);

  // Handle column drag over
  const handleColumnDragOver = useCallback((e: React.DragEvent, componentId: string, columnIndex: number) => {
    if (!isInteractive || !draggedColumn) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn({ componentId, columnIndex });
  }, [isInteractive, draggedColumn]);

  // Handle column drop
  const handleColumnDrop = useCallback((e: React.DragEvent, targetComponentId: string, targetColumnIndex: number) => {
    if (!isInteractive || !draggedColumn || !onDataChange) return;
    
    e.preventDefault();
    
    const { componentId: sourceComponentId, columnIndex: sourceColumnIndex } = draggedColumn;
    
    // Only allow dropping within the same GridContainer
    if (sourceComponentId !== targetComponentId) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }
    
    // Don't do anything if dropping on the same column
    if (sourceColumnIndex === targetColumnIndex) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }
    
    const newData = { ...localData };
    const sourceZoneKey = `${sourceComponentId}:column-${sourceColumnIndex}`;
    const targetZoneKey = `${targetComponentId}:column-${targetColumnIndex}`;
    
    // Swap the column contents
    if (newData.zones[sourceZoneKey] && newData.zones[targetZoneKey]) {
      const sourceContent = newData.zones[sourceZoneKey];
      const targetContent = newData.zones[targetZoneKey];
      
      // Swap the contents
      newData.zones[sourceZoneKey] = targetContent;
      newData.zones[targetZoneKey] = sourceContent;
      
      setLocalData(newData);
      onDataChange(newData);
    }
    
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [isInteractive, draggedColumn, onDataChange, localData]);

  // Handle column drag end
  const handleColumnDragEnd = useCallback(() => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, []);

  // Separate PdfViewer components from other components
  const pdfViewers = localData.content?.filter((item: any) => item.type === 'PdfViewer') || [];
  const otherContent = localData.content?.filter((item: any) => item.type !== 'PdfViewer') || [];

  return (
    <div className="h-full w-full overflow-auto bg-white">
      {/* Render PdfViewer components outside the constrained container for full-page display */}
      {pdfViewers.map((item: any, index: number) => {
        const Component = config.components[item.type as keyof typeof config.components]?.render;
        if (Component) {
          const componentProps = { ...item.props };
          // Don't pass puck object in preview mode for PdfViewer
          return <Component key={`pdf-${index}`} {...componentProps} />;
        }
        return null;
      })}
      
      {/* Render other components in full width */}
      <div className="w-full">
        <div className="w-full">
          {otherContent.length === 0 && pdfViewers.length === 0 ? (
            <div className="space-y-2 px-5 py-[60px] text-center text-lg text-slate-500 w-full">
              <h2 className="text-2xl font-semibold text-slate-700">
                No content to preview
              </h2>
              <p>Switch back to edit mode to add components</p>
            </div>
          ) : (
            otherContent.map((item: any, index: number) => {
            const Component =
              config.components[item.type as keyof typeof config.components]
                ?.render;

            if (Component) {
              const componentId = item.props?.id;

              // For components with zones, look for zone data with the component ID + zone name format
              let zoneContent: any = null;
              if (componentId && localData.zones) {
                // First try the old format (component ID only)
                zoneContent = localData.zones[componentId];

                // If not found, look for zone data with component ID + zone name format
                if (
                  !zoneContent &&
                  (item.type === "GridContainer" || item.type === "GridLayout")
                ) {
                  const zoneKeys = Object.keys(localData.zones).filter((key) =>
                    key.startsWith(componentId + ":")
                  );
                  if (zoneKeys.length > 0) {
                    // Create a zone content object from the zone keys
                    zoneContent = {};
                    zoneKeys.forEach((key) => {
                      const zoneName = key.split(":")[1]; // Extract zone name after the colon
                      zoneContent[zoneName] = localData.zones[key];
                    });
                  }
                }
              }


              // Prepare props with zone content for components that use zones
              const componentProps = { ...item.props };
              
              // Add puck object for interactive mode
              if (isInteractive) {
                componentProps.puck = {
                  dragRef: (element: HTMLElement | null) => {
                    if (element) {
                      element.draggable = true;
                      element.style.cursor = 'move';
                    }
                  }
                };
              }

              if (zoneContent) {
                // Handle different zone structures
                let zoneItems: any[] = [];

                if (zoneContent.content && Array.isArray(zoneContent.content)) {
                  zoneItems = zoneContent.content;
                } else if (
                  zoneContent.children &&
                  Array.isArray(zoneContent.children)
                ) {
                  zoneItems = zoneContent.children;
                } else if (Array.isArray(zoneContent)) {
                  zoneItems = zoneContent;
                } else if (typeof zoneContent === "object") {
                  // If zoneContent is an object, it might be the zone data itself
                  // Check if it has zone properties
                  Object.keys(zoneContent).forEach((key) => {
                    if (
                      key.startsWith("column-") &&
                      Array.isArray(zoneContent[key])
                    ) {
                      zoneItems = zoneItems.concat(
                        zoneContent[key].map((item: any) => ({
                          ...item,
                          zone: key,
                        }))
                      );
                    }
                  });
                }


                // For components with zones (like GridContainer and GridLayout), pass zone content as props
                if (
                  item.type === "GridContainer" ||
                  item.type === "GridLayout"
                ) {
                  // First check if column data is already in component props (direct format)
                  const hasDirectColumnData = Object.keys(componentProps).some(key => 
                    key.startsWith("column-") && Array.isArray(componentProps[key])
                  );
                  
                  if (hasDirectColumnData) {
                    // Column data is already in props, use it directly
                  } else if (
                    typeof zoneContent === "object" &&
                    !Array.isArray(zoneContent)
                  ) {
                    // If zoneContent is already an object with zone names as keys, use it directly
                    Object.keys(zoneContent).forEach((zoneName) => {
                      if (
                        zoneName.startsWith("column-") &&
                        Array.isArray(zoneContent[zoneName])
                      ) {
                        componentProps[zoneName] = zoneContent[zoneName];
                      }
                    });
                  } else {
                    // Group zone items by their zone names (fallback for other formats)
                    zoneItems.forEach((zoneItem: any) => {
                      const zoneName = zoneItem.zone || "column-0"; // Default to first column if no zone specified
                      if (!componentProps[zoneName]) {
                        componentProps[zoneName] = [];
                      }
                      componentProps[zoneName].push(zoneItem);
                    });
                  }

                  // For interactive mode, render custom GridContainer with drop zones
                  if (isInteractive && item.type === 'GridContainer') {
                      const columns = componentProps.columns || 2;
                      const gap = componentProps.gap || '16px';
                      const rowGap = componentProps.rowGap || '16px';
                      
                      return (
                        <div key={index} className="my-4">
                          <div
                            className="my-4 grid min-h-[100px] rounded-lg border border-slate-200 bg-slate-100 p-4"
                            style={{
                              gridTemplateColumns: `repeat(${columns}, 1fr)`,
                              gap,
                              rowGap,
                            }}
                          >
                            {Array.from({ length: columns }, (_, colIndex) => {
                              const zoneName = `column-${colIndex}`;
                              const zoneItems = componentProps[zoneName] || [];
                              const isDragOver = dragOverZone === zoneName;
                              const isColumnDragOver =
                                dragOverColumn?.componentId === componentId &&
                                dragOverColumn?.columnIndex === colIndex;
                              const isColumnDragged =
                                draggedColumn?.componentId === componentId &&
                                draggedColumn?.columnIndex === colIndex;

                              const columnClassName = cn(
                                "relative min-h-[50px] rounded border border-dashed border-slate-300 p-2 transition-all duration-200",
                                isInteractive ? "cursor-move" : "cursor-default",
                                isDragOver && "border-2 border-sky-500 bg-sky-100",
                                !isDragOver && isColumnDragOver && "border-2 border-amber-500 bg-amber-100",
                                isColumnDragged && "opacity-50"
                              );

                              return (
                                <div
                                  key={colIndex}
                                  className={columnClassName}
                                  draggable={isInteractive}
                                  onDragStart={(e) => handleColumnDragStart(e, componentId, colIndex)}
                                  onDragOver={(e) => {
                                    handleDragOver(e, zoneName);
                                    handleColumnDragOver(e, componentId, colIndex);
                                  }}
                                  onDrop={(e) => {
                                    handleDrop(e, zoneName);
                                    handleColumnDrop(e, componentId, colIndex);
                                  }}
                                  onDragEnd={handleColumnDragEnd}
                                >
                                  {/* Column header for drag indication - only show when dragging */}
                                  {isInteractive && (isColumnDragged || isColumnDragOver) && (
                                    <div
                                      className={cn(
                                        "absolute inset-x-2 -top-2 z-10 flex h-5 items-center justify-center rounded-t-md text-[11px] font-bold text-white shadow-sm",
                                        isColumnDragged ? "bg-blue-500" : "bg-amber-500",
                                      )}
                                    >
                                      {isColumnDragged ? "DRAGGING" : "DROP HERE"}
                                    </div>
                                  )}

                                  {zoneItems.length > 0 ? (
                                    zoneItems.map((zoneItem: any, itemIndex: number) => {
                                      const ZoneComponent = config.components[zoneItem.type as keyof typeof config.components]?.render;
                                      const zoneProps = { ...zoneItem.props };

                                      // Add puck object for nested components in interactive mode
                                      if (isInteractive) {
                                        zoneProps.puck = {
                                          dragRef: (element: HTMLElement | null) => {
                                            if (element) {
                                              element.draggable = true;
                                              element.style.cursor = "move";
                                              element.dataset.dragItem = JSON.stringify(zoneItem);
                                              element.dataset.sourceZone = zoneName;
                                              element.addEventListener("dragstart", (e) => {
                                                handleDragStart(e as any, { ...zoneItem, componentId }, zoneName);
                                              });
                                              element.addEventListener("dragend", handleDragEnd);
                                            }
                                          },
                                        };
                                      }

                                      return ZoneComponent ? (
                                        <ZoneComponent key={itemIndex} {...zoneProps} />
                                      ) : (
                                        <div
                                          key={itemIndex}
                                          className="cursor-move rounded border border-slate-300 bg-slate-100 p-2"
                                          draggable={true}
                                          onDragStart={(e) => {
                                            handleDragStart(e, { ...zoneItem, componentId }, zoneName);
                                          }}
                                        >
                                          Test Draggable: {zoneItem.type}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="flex min-h-[50px] items-center justify-center rounded border border-dashed border-slate-300 text-sm text-slate-500">
                                      Drop components here
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                } else if (zoneItems.length > 0) {
                  // For other components, render zone content as children
                  const ZoneContent = zoneItems.map(
                    (zoneItem: any, zoneIndex: number) => {
                      const ZoneComponent =
                        config.components[
                          zoneItem.type as keyof typeof config.components
                        ]?.render;
                      return ZoneComponent ? (
                        <ZoneComponent key={zoneIndex} {...zoneItem.props} />
                      ) : null;
                    }
                  );

                  return (
                    <Component key={index} {...componentProps}>
                      {ZoneContent}
                    </Component>
                  );
                }
              }

              return <Component key={index} {...componentProps} />;
            }

            return null;
          })
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
