import * as React from "react";
import * as CM from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const ContextMenu = CM.Root;
export const ContextMenuTrigger = CM.Trigger;
export const ContextMenuGroup = CM.Group;
export const ContextMenuPortal = CM.Portal;
export const ContextMenuSub = CM.Sub;
export const ContextMenuRadioGroup = CM.RadioGroup;

export const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <CM.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </CM.SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <CM.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <CM.Portal>
    <CM.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </CM.Portal>
));
ContextMenuContent.displayName = "ContextMenuContent";

export const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <CM.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

export const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <CM.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CM.ItemIndicator><Check className="h-4 w-4" /></CM.ItemIndicator>
    </span>
    {children}
  </CM.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <CM.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CM.ItemIndicator><Circle className="h-2 w-2 fill-current" /></CM.ItemIndicator>
    </span>
    {children}
  </CM.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <CM.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)} {...props} />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

export const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CM.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export const ContextMenuShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
);
