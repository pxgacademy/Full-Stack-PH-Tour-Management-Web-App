import type { iChildren } from "@/global-interfaces";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface iProps extends iChildren {
  buttonText: string | ReactNode;
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const SheetWrapper = ({
  children,
  buttonText,
  title,
  open,
  setOpen,
}: iProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">{buttonText}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mb-4">{title}</SheetTitle>
          <SheetDescription asChild>{children}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
