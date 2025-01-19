"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import { Loader2, MenuIcon, Package, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { selectItems } from "@/state/cart/cartSlice";
import { useAppSelector } from "@/state/hooks";

const navigation = [
  { name: "Products" },
  { name: "Categories" },
  { name: "Brands" },
  { name: "Sale" }
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cart = useAppSelector(selectItems);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 p-5 md:px-10">
          <div>
            <Link href="/" className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tight">ECOMMERCE</h1>
            </Link>

            <MenuIcon
              onClick={() => setIsOpen(true)}
              className="size-7 cursor-pointer md:hidden"
            />
          </div>

          <div className="flex justify-center">
            <div className="hidden items-center justify-center gap-2 md:flex">
              {navigation.map((item) => (
                <Button key={item.name} variant="link">
                  {item.name}
                </Button>
              ))}
            </div>

            <Link href="/" className="md:hidden">
              <h1 className="text-xl font-bold tracking-tight">ECOMMERCE</h1>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-6">
            <Link href="/cart" className="relative hidden md:inline-flex">
              <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {cart.length}
              </span>

              <ShoppingCart className="size-7" />
            </Link>

            <ClerkLoaded>
              <SignedIn>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Orders"
                      labelIcon={<Package className="size-4" />}
                      href="/orders"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-7 animate-spin text-muted-foreground" />
            </ClerkLoading>
          </div>
        </div>
      </header>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          {navigation.map((item) => (
            <Button
              key={item.name}
              variant="link"
              className="focus-visible:ring-transparent"
            >
              {item.name}
            </Button>
          ))}

          <Button asChild variant="link">
            <Link href="/cart">Cart ({cart.length})</Link>
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
};
