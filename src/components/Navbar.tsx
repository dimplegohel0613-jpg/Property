"use client";

import { useState, useEffect, useCallback } from "react";

interface NavbarProps {
  activeIndex: number;
  onNavClick: (index: number) => void;
}

const links = ["Home", "Details", "Neighborhood", "Why"];

export default function Navbar({ activeIndex, onNavClick }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    document.body.classList.remove("nav-drawer-open");
  }, []);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("nav-drawer-open", next);
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove("nav-drawer-open");
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <a
          className="nav-brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavClick(0);
            closeDrawer();
          }}
        >
          Dimple
        </a>
        <div className="nav-links" id="navLinks">
          {links.map((label, i) => (
            <a
              key={i}
              className={`nav-link ${i === activeIndex ? "is-active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavClick(i);
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          className="nav-cta nav-cta-desktop"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavClick(4);
          }}
        >
          Contact Us
        </a>
        <button
          type="button"
          className="nav-menu-btn"
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={toggleDrawer}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {drawerOpen && (
        <div
          className="nav-scrim"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      <div
        className="nav-drawer"
        hidden={!drawerOpen}
        id="navDrawer"
      >
        <div className="nav-drawer-inner">
          {links.map((label, i) => (
            <a
              key={i}
              className={`nav-drawer-link ${i === activeIndex ? "is-active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavClick(i);
                closeDrawer();
              }}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-drawer-cta"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavClick(4);
              closeDrawer();
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
