"use client";

import React, { useState } from "react";
import { X, Play, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

interface TestResult {
  testId: number;
  name: string;
  passed: boolean;
  details: string;
}

interface TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestSuiteModal({ isOpen, onClose }: TestSuiteModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [summary, setSummary] = useState<{ total: number; passed: number; allPassed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const runTests = async () => {
    try {
      setIsRunning(true);
      setError(null);
      const res = await fetch("/api/v1/test-suite");
      const data = await res.json();

      if (!res.ok && !data.results) {
        throw new Error(data.error || "Failed to execute test suite");
      }

      setResults(data.results || []);
      setSummary({
        total: data.total || 0,
        passed: data.passedCount || 0,
        allPassed: data.allPassed || false
      });
    } catch (err: any) {
      setError(err?.message || "Failed to run tests");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200/70 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Memory Contradiction &amp; Clarification Test Suite
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Automated verification of 10 epistemic consistency &amp; clarification scenarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200/60">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                10 Core Behavioral Test Scenarios
              </span>
              <span className="text-[11px] text-stone-500 font-sans">
                Tests Friends+Sheldon mismatch, confirmation flow, multiple Sams, dual roles, time tolerance, and provenance.
              </span>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running Engine...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Run All Tests
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {summary && (
            <div
              className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${
                summary.allPassed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <span>
                Test Summary: {summary.passed} of {summary.total} tests passing
              </span>
              <span className="font-bold">
                {summary.allPassed ? "100% SUCCESS" : "CHECK DETAILS"}
              </span>
            </div>
          )}

          {results && (
            <div className="space-y-2.5">
              {results.map((r) => (
                <div
                  key={r.testId}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                    r.passed
                      ? "bg-stone-50/70 border-stone-200 text-stone-800"
                      : "bg-red-50/80 border-red-200 text-red-900"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-stone-900">
                        Test {r.testId}: {r.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          r.passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {r.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif mt-1">
                      {r.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200/70 flex justify-end bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
