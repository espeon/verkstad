"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
  useAnimation,
  useScroll,
  useTransform,
} from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { ColorToggle } from "./colorMode";
import { GoPersonFill } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function logoutHandler() {
  // call /login/out
  fetch("/login/out", {
    method: "POST",
  })
    .then((res) => {
      res.text().then((data) => data !== "no" && "ok");
    })
    .catch((err) => {
      console.error(err);
    });
  window.location.replace("/login");
}

export default function Header() {
  // logo scrolling
  const [scrolled, setScrolled] = useState(false);
  const logoControls = useAnimation();
  const navControls = useAnimation();
  const { scrollY, scrollYProgress } = useScroll();

  // get current page
  const basePath = usePathname().split("/")[1];
  const [activeNavItem, setActiveNavItem] = useState<string | null>(basePath);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "buckets", label: "Buckets" },
    { id: "settings", label: "Settings" },
  ];
  const handleNavItemClick = (navId: string) => {
    setActiveNavItem(navId);
    setHoveredNavItem(null);
  };
  const handleNavItemHover = (navId: string) => {
    setHoveredNavItem(navId);
  };
  const handleNavItemMouseLeave = () => {
    setHoveredNavItem(null);
  };
  const navTranslateY = useTransform(scrollY, [0, 50], ["0rem", "-4rem"]);
  const navPaddingLeft = useTransform(scrollY, [0, 50], ["0rem", "9rem"]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.5]);
  const logoBoxTranslateY = useTransform(scrollY, [0, 50], ["0rem", "-5rem"]);
  const logoTranslateY = useTransform(scrollY, [0, 50], ["0rem", "8.9rem"]);
  const logoMarginTop = useTransform(scrollY, [0, 30], ["2rem", "1rem"]);

  return (
    <motion.div style={{ translateY: navTranslateY }} className="sticky top-0 w-full border-b-2 bg-slate-50 dark:bg-slate-950 dark:border-gray-800 pb-2 px-24">
      <motion.div
        style={{ translateY: logoBoxTranslateY }}
        className="z-10 pointer-events-none mx-auto flex justify-between items-center  dark:text-white text-black dark:border-gray-800"
      >
        <motion.div
          style={{
            scale: logoScale,
            marginTop: logoMarginTop,
            translateY: logoTranslateY,
          }}
          // transition={{ type: "spring", stiffness: 300 }}
          className="z-10 origin-top-left"
        >
          <div className="text-5xl mb-2">logo header</div>
        </motion.div>
      </motion.div>
      <motion.div style={{ paddingLeft: navPaddingLeft }}>
        <nav className="container mx-auto flex justify-between items-center dark:text-white text-black dark:border-gray-800 max-w-screen-2xl header-hide-scrollbar">
          <ul className="flex flex-1 z-20">
            {navItems.map((nav) => (
              <Link
                key={nav.id}
                href={`/${nav.id}`}
                className={`relative z-20  ${
                  activeNavItem === nav.id
                    ? "dark:text-gray-200 text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <li
                  onClick={() => handleNavItemClick(nav.id)}
                  onMouseMove={() => handleNavItemHover(nav.id)}
                  onMouseLeave={handleNavItemMouseLeave}
                  className="relative px-4 py-2 transition-colors"
                >
                  {nav.label}
                  {hoveredNavItem === nav.id && (
                    <motion.span
                      layoutId="hover"
                      transition={{ type: "spring", duration: 0.3 }}
                      className="absolute inset-0 -z-10 bg-slate-300/30 dark:bg-slate-800/50 rounded-lg"
                    ></motion.span>
                  )}
                  {activeNavItem === nav.id && (
                    <motion.span
                      layoutId="active"
                      transition={{ type: "spring", duration: 0.5 }}
                      className="z-50 inset-0 absolute border-b-2 -mb-2.5 border-black dark:border-gray-200"
                    ></motion.span>
                  )}
                </li>
              </Link>
            ))}
          </ul>
          <DropdownMenu>
            <ColorToggle className="mr-2" />
            <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 p-0 rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
              <GoPersonFill className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => logoutHandler()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </motion.div>
    </motion.div>
  );
}
function setIsScrolled(arg0: boolean) {
  throw new Error("Function not implemented.");
}
