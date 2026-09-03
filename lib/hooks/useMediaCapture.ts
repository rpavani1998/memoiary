"use client";

import { useState, useRef, useCallback } from "react";

export type MediaType = "audio" | "image" | "video";

export interface MediaCaptureResult {
  base64: string;
  mimeType: string;
  blob: Blob;
  type: MediaType;
}

export interface MediaAnalysis {
  transcription?: string;
  sceneDescription?: string;
  speakerEmotion?: string;
  tone?: string;
  speechPatterns?: string;
  people?: string[];
  locationHints?: string[];
  mood?: string;
  objects?: string[];
  textInImage?: string[];
  timeHints?: string[];
  keyMoments?: string[];
  audioAnalysis?: string;
  summary?: string;
}

interface UseMediaCaptureOptions {
  audio?: { echoCancellation?: boolean; noiseSuppression?: boolean };
  video?: { width?: number; height?: number; facingMode?: "user" | "environment" };
}

export function useMediaCapture(options: UseMediaCaptureOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
  }, []);

  const startTimer = useCallback(() => {
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // ─── Audio Recording ────────────────────────────────────────────
  const startAudioRecording = useCallback(async () => {
    setError(null);
    try {
      console.log("[mic] requesting getUserMedia...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: options.audio?.echoCancellation ?? true,
          noiseSuppression: options.audio?.noiseSuppression ?? true
        }
      });
      console.log("[mic] got stream, tracks:", stream.getAudioTracks().length);
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      console.log("[mic] using mimeType:", mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onerror = (e) => {
        console.error("[mic] MediaRecorder error:", e);
        setError("Recording error occurred.");
      };

      recorder.start(1000);
      console.log("[mic] recorder started, state:", recorder.state);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      startTimer();
    } catch (err: any) {
      console.error("[mic] startAudioRecording failed:", err?.name, err?.message);
      setError(err?.name === "NotAllowedError"
        ? "Microphone access denied. Please allow mic access in your browser settings."
        : err?.name === "NotFoundError"
        ? "No microphone found. Please connect a microphone."
        : `Could not access microphone: ${err?.message || err?.name}`);
      throw err;
    }
  }, [options.audio, startTimer]);

  const stopAudioRecording = useCallback((): Promise<MediaCaptureResult> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        reject(new Error("No active recording"));
        return;
      }

      stopTimer();

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          cleanup();
          resolve({
            base64,
            mimeType: recorder.mimeType,
            blob,
            type: "audio"
          });
        };
        reader.onerror = () => {
          cleanup();
          reject(new Error("Failed to read audio data"));
        };
        reader.readAsDataURL(blob);
      };

      recorder.stop();
    });
  }, [stopTimer, cleanup]);

  // ─── Photo Capture ──────────────────────────────────────────────
  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: options.video?.width ?? { ideal: 1280 },
          height: options.video?.height ?? { ideal: 720 },
          facingMode: options.video?.facingMode ?? "environment"
        }
      });
      streamRef.current = stream;
      videoElement.srcObject = stream;
      videoElement.play();
      videoRef.current = videoElement;
      canvasRef.current = document.createElement("canvas");
    } catch (err: any) {
      setError(err?.name === "NotAllowedError"
        ? "Camera access denied. Please allow camera access in your browser settings."
        : "Could not access camera.");
      throw err;
    }
  }, [options.video]);

  const capturePhoto = useCallback((): MediaCaptureResult | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1];

    // Convert to blob manually for consistency
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: "image/jpeg" });

    return { base64, mimeType: "image/jpeg", blob, type: "image" };
  }, []);

  const stopCamera = useCallback(() => {
    cleanup();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    canvasRef.current = null;
  }, [cleanup]);

  // ─── Video Recording ────────────────────────────────────────────
  const startVideoRecording = useCallback(async (videoElement: HTMLVideoElement) => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: options.video?.width ?? { ideal: 1280 },
          height: options.video?.height ?? { ideal: 720 },
          facingMode: options.video?.facingMode ?? "environment"
        },
        audio: true
      });
      streamRef.current = stream;
      videoElement.srcObject = stream;
      videoElement.play();
      videoRef.current = videoElement;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
            ? "video/webm;codecs=vp8,opus"
            : "video/webm"
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(1000);
      setIsRecording(true);
      startTimer();
    } catch (err: any) {
      setError(err?.name === "NotAllowedError"
        ? "Camera/microphone access denied."
        : "Could not access camera.");
      throw err;
    }
  }, [options.video, startTimer]);

  const stopVideoRecording = useCallback((): Promise<MediaCaptureResult> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        reject(new Error("No active recording"));
        return;
      }

      stopTimer();

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          cleanup();
          resolve({
            base64,
            mimeType: recorder.mimeType,
            blob,
            type: "video"
          });
        };
        reader.onerror = () => {
          cleanup();
          reject(new Error("Failed to read video data"));
        };
        reader.readAsDataURL(blob);
      };

      recorder.stop();
    });
  }, [stopTimer, cleanup]);

  // ─── Pause / Resume ─────────────────────────────────────────────
  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [startTimer]);

  const togglePause = useCallback(() => {
    if (isPaused) resumeRecording();
    else pauseRecording();
  }, [isPaused, pauseRecording, resumeRecording]);

  // ─── Send to Backend for Gemini Analysis ────────────────────────
  const analyzeMedia = useCallback(async (
    mediaBase64: string,
    mimeType: string,
    mediaType: MediaType,
    customPrompt?: string
  ): Promise<MediaAnalysis> => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/v1/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaBase64, mimeType, mediaType, prompt: customPrompt })
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      return data.result || {};
    } catch (err) {
      console.warn("Media analysis failed:", err);
      return {};
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const formatDuration = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    isPaused,
    duration,
    error,
    analyzing,
    formatDuration,
    startAudioRecording,
    stopAudioRecording,
    startCamera,
    capturePhoto,
    stopCamera,
    startVideoRecording,
    stopVideoRecording,
    pauseRecording,
    resumeRecording,
    togglePause,
    analyzeMedia,
    cleanup
  };
}
