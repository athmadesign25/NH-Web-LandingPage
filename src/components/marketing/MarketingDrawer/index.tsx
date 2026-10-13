"use client";

/**
 * Prototype harness for the marketing drawer.
 *
 * Holds the config in local state so the control panel can drive it live.
 * When this moves to the CMS, `config` arrives as a prop and both the
 * toggle and the panel disappear — the drawer itself is unchanged.
 */

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import MarketingDrawer from "./MarketingDrawer";
import DrawerControlPanel from "./DrawerControlPanel";
import { type BannerConfig, DEFAULT_CONFIG } from "./types";
import styles from "./harness.module.css";

export default function MarketingDrawerLab() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG);
  const [mounted, setMounted] = useState(false);
  // Stable identity. As an inline arrow this changed on every render, so the
  // drawer's effect tore down and re-ran on each control-panel keystroke —
  // briefly releasing the scroll lock and restarting paused videos.
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const ui = (
    <>
      {/* Fixed, so it is reachable from anywhere on the page — the drawer
          has to be testable against every section behind it, not just the
          hero. Hidden while open so it does not sit over the scrim. */}
      {!open && (
        <button type="button" className={styles.toggle} onClick={() => setOpen(true)}>
          Toggle Drawer
        </button>
      )}

      <MarketingDrawer open={open} config={config} onClose={close} />

      <AnimatePresence>
        {open && <DrawerControlPanel config={config} onChange={setConfig} />}
      </AnimatePresence>
    </>
  );

  // Portaled to <body>. The page renders inside <main z-index: 1>, which is
  // a stacking context — so however high the scrim's z-index, it was being
  // clamped inside that context and the navbar painted over it. A portal is
  // the only way out of an ancestor stacking context; raising the z-index
  // cannot fix it. Same reason the search experience portals when docked.
  return createPortal(ui, document.body);
}
