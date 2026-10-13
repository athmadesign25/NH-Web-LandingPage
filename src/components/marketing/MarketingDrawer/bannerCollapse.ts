/**
 * Tiny shared store for the drawer's collapsed state.
 *
 * The FAB variant has to render INSIDE FloatingQuickActions — it is a
 * fourth tile in that bar, not a lookalike floating beside it — and that
 * component sits in a different part of the tree. A module-level store is
 * the smallest thing that lets the drawer tell it to make room.
 */

export type CollapseMode = "toast" | "fab";

let collapsed: CollapseMode | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const bannerCollapse = {
  show(mode: CollapseMode) {
    collapsed = mode;
    emit();
  },
  clear() {
    collapsed = null;
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  get: () => collapsed,
  /** Server render has no collapsed state, so it must agree with the first
      client render or hydration mismatches. */
  getServerSnapshot: () => null,
};
