declare module '*.mp3';
declare module '@heroicons/react/solid' {
    import { ComponentType, SVGProps } from 'react';
    const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
    export default icons;
    export const TrashIcon: ComponentType<SVGProps<SVGSVGElement>>;
  }
  
  declare module '@heroicons/react/outline' {
    import { ComponentType, SVGProps } from 'react';
    const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
    export default icons;
    export const TrashIcon: ComponentType<SVGProps<SVGSVGElement>>;
  }

  declare module 'react-beautiful-dnd' {
    import * as React from 'react';
  
    export interface DragDropContextProps {
      onDragEnd: (result: DropResult) => void;
      onDragStart?: (initial: DragStart) => void;
      onDragUpdate?: (update: DragUpdate) => void;
      children?: React.ReactNode;
    }
  
    export class DragDropContext extends React.Component<DragDropContextProps> {}
  
    export interface DroppableProps {
      droppableId: string;
      isDropDisabled?: boolean;
      direction?: 'horizontal' | 'vertical';
      type?: string;
      children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
    }
  
    export class Droppable extends React.Component<DroppableProps> {}
  
    export interface DraggableProps {
      draggableId: string;
      index: number;
      isDragDisabled?: boolean;
      children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
    }
  
    export class Draggable extends React.Component<DraggableProps> {}
  
    export interface DraggableProvided {
      draggableProps: {
        [key: string]: any;
      };
      dragHandleProps?: {
        [key: string]: any;
      } | null;
      innerRef: (element?: HTMLElement | null) => void;
    }
  
    export interface DraggableStateSnapshot {
      isDragging: boolean;
      draggingOver?: string;
    }
  
    export interface DroppableProvided {
      droppableProps: {
        [key: string]: any;
      };
      innerRef: (element?: HTMLElement | null) => void;
      placeholder?: React.ReactNode;
    }
  
    export interface DroppableStateSnapshot {
      isDraggingOver: boolean;
      draggingOverWith?: string;
    }
  
    export interface DragStart {
      draggableId: string;
      type: string;
      source: DraggableLocation;
    }
  
    export interface DragUpdate extends DragStart {
      destination?: DraggableLocation;
    }
  
    export interface DropResult extends DragUpdate {
      reason: 'DROP' | 'CANCEL';
    }
  
    export interface DraggableLocation {
      droppableId: string;
      index: number;
    }
  }
  