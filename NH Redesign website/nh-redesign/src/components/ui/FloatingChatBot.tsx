"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "84px",
              right: "24px",
              width: "320px",
              height: "400px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--color-primary, #034EA2)",
                color: "#fff",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>NH Assistant</h3>
                  <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: "20px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: "var(--color-primary, #034EA2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <MessageCircle size={14} />
                </div>
                <div style={{ backgroundColor: "#fff", padding: "12px 16px", borderRadius: "0 12px 12px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", fontSize: "14px", color: "var(--color-text, #1E293B)", lineHeight: 1.5 }}>
                  Hi there! I'm your Narayana Health Assistant. How can I help you today?
                </div>
              </div>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#fff", borderTop: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: "1px solid #E2E8F0",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary, #034EA2)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--color-primary, #034EA2)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 14px rgba(3, 78, 162, 0.4)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Toggle Chat Bot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
