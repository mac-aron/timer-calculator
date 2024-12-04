import React, { useState, useEffect } from "react";

const TimerCalculator: React.FC = () => {
  // State for inputs
  const [speed, setSpeed] = useState<number | undefined>(undefined);
  const [resolution, setResolution] = useState<number>(8);
  const [prescaler, setPrescaler] = useState<number>(0);

  // State for results
  const [totalTicks, setTotalTicks] = useState<number | undefined>(undefined);
  const [realTime, setRealTime] = useState<string>("");
  const [newFrequency, setNewFrequency] = useState<number | undefined>(
    undefined
  );

  // State to track the active field
  const [activeField, setActiveField] = useState<string | null>(null);
  const [totalTicksError, setTotalTicksError] = useState<string | null>(null);

  // Derived friendly representations
  const friendlyFrequency = speed
    ? speed >= 1e9
      ? `${(speed / 1e9).toFixed(2)} GHz`
      : speed >= 1e6
      ? `${(speed / 1e6).toFixed(2)} MHz`
      : speed >= 1e3
      ? `${(speed / 1e3).toFixed(2)} kHz`
      : ""
    : "";

  const friendlyRealTime = realTime
    ? parseFloat(realTime) >= 1 || parseFloat(realTime) === 0
      ? ""
      : parseFloat(realTime) >= 1e-3
      ? `${(parseFloat(realTime) * 1e3).toFixed(2)} milliseconds`
      : parseFloat(realTime) >= 1e-6
      ? `${(parseFloat(realTime) * 1e6).toFixed(2)} microseconds`
      : `${(parseFloat(realTime) * 1e9).toFixed(2)} nanoseconds`
    : "";

  // Recalculation logic
  useEffect(() => {
    if (speed && prescaler >= 0 && resolution) {
      if (activeField === "totalTicks" && totalTicks !== undefined) {
        const time = totalTicks / (speed / Math.pow(2, prescaler));
        const frequency = 1 / time;

        setRealTime(time.toString());
        setNewFrequency(frequency);
      } else if (activeField === "realTime" && realTime !== "") {
        const time = parseFloat(realTime);
        if (!isNaN(time)) {
          const ticks = time * (speed / Math.pow(2, prescaler));
          const frequency = 1 / time;

          setTotalTicks(ticks);
          setNewFrequency(frequency);
        }
      } else if (activeField === "newFrequency" && newFrequency !== undefined) {
        const time = 1 / newFrequency;
        const ticks = time * (speed / Math.pow(2, prescaler));

        setRealTime(time.toString());
        setTotalTicks(ticks);
      }
    }
  }, [
    speed,
    resolution,
    prescaler,
    totalTicks,
    realTime,
    newFrequency,
    activeField,
  ]);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Timer Calculator</h2>

      {/* Input for speed */}
      <label>
        Speed (Hz):
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            value={speed || ""}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span style={{ marginLeft: "10px" }}>{friendlyFrequency}</span>
        </div>
      </label>
      <br />

      {/* Dropdown for resolution */}
      <label>
        Counter Resolution:
        <select
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
        >
          {[8, 16, 32].map((res) => (
            <option key={res} value={res}>
              {res} bit
            </option>
          ))}
        </select>
      </label>
      <br />

      {/* Dropdown for prescaler */}
      <label>
        Prescaler:
        <select
          value={prescaler}
          onChange={(e) => setPrescaler(Number(e.target.value))}
        >
          {Array.from({ length: 9 }, (_, i) => i).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <span style={{ marginLeft: "10px" }}>{friendlyRealTime}</span>
      </label>
      <br />

      <hr />

      {/* Result fields */}
      <label>
        Total Counter Ticks:
        <input
          type="number"
          value={totalTicks || ""}
          onChange={(e) => {
            setTotalTicks(Number(e.target.value));
            setActiveField("totalTicks");
          }}
        />
      </label>
      <br />

      <label>
        Real Time (s):
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={realTime}
            onChange={(e) => {
              setRealTime(e.target.value);
              setActiveField("realTime");
            }}
            onBlur={() => {
              if (realTime !== "") {
                const parsed = parseFloat(realTime);
                if (!isNaN(parsed)) {
                  setRealTime(parsed.toString());
                } else {
                  setRealTime("");
                }
              }
            }}
          />
          <span style={{ marginLeft: "10px" }}>{friendlyRealTime}</span>
        </div>
      </label>
      <br />

      <label>
        New Frequency (Hz):
        <input
          type="number"
          value={newFrequency || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setTotalTicks(value);
            setActiveField("totalTicks");
          }}
        />
      </label>
      {totalTicksError && (
        <span style={{ color: "red", fontSize: "0.9em" }}>
          {totalTicksError}
        </span>
      )}
    </div>
  );
};

export default TimerCalculator;
