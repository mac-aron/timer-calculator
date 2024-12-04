import React, { useState, useEffect } from "react";

const TimerCalculator: React.FC = () => {
  // State for inputs
  const [speed, setSpeed] = useState<number | undefined>(16000000);
  const [resolution, setResolution] = useState<number>(32);
  const [prescaler, setPrescaler] = useState<number>(3);

  // State for results
  const [totalTicks, setTotalTicks] = useState<number | undefined>(undefined);
  const [realTime, setRealTime] = useState<number | undefined>(undefined);
  const [newFrequency, setNewFrequency] = useState<number | undefined>(
    undefined
  );

  // State to track the active field
  const [activeField, setActiveField] = useState<string | null>(null);

  // Dropdown options
  const resolutionOptions = [8, 16, 32];
  const prescalerOptions = Array.from({ length: 9 }, (_, i) => i);

  // Recalculation logic
  useEffect(() => {
    if (speed && prescaler >= 0 && resolution) {
      if (activeField === "totalTicks" && totalTicks !== undefined) {
        const time = totalTicks / (speed / Math.pow(2, prescaler));
        const frequency = 1 / time;

        setRealTime(time);
        setNewFrequency(frequency);
      } else if (activeField === "realTime" && realTime !== undefined) {
        const ticks = realTime * (speed / Math.pow(2, prescaler));
        const frequency = 1 / realTime;

        setTotalTicks(ticks);
        setNewFrequency(frequency);
      } else if (activeField === "newFrequency" && newFrequency !== undefined) {
        const time = 1 / newFrequency;
        const ticks = time * (speed / Math.pow(2, prescaler));

        setRealTime(time);
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
    <div className="timer-calculator">
      <h2>Timer calculator</h2>

      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Speed (Hz)
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              Enter the clock speed in Hz (e.g., 16000000 for 16 MHz).
            </span>
          </div>
        </span>
        <input
          type="number"
          value={speed || ""}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>

      {/* Dropdown for resolution */}
      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Counter resolution
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              Currently this field does not affect the calculation.
            </span>
          </div>
        </span>
        <select
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
        >
          {resolutionOptions.map((res) => (
            <option key={res} value={res}>
              {res} bit
            </option>
          ))}
        </select>
      </label>

      {/* Dropdown for prescaler */}
      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Prescaler
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              The prescaler divides the clock frequency by 2^prescaler.
            </span>
          </div>
        </span>
        <select
          value={prescaler}
          onChange={(e) => setPrescaler(Number(e.target.value))}
        >
          {prescalerOptions.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </label>

      <hr />

      {/* Result fields */}
      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Total counter ticks
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              Total number of ticks the counter until reaches the flag.
            </span>
          </div>
        </span>
        <input
          type="number"
          value={totalTicks || ""}
          onChange={(e) => {
            setTotalTicks(Number(e.target.value));
            setActiveField("totalTicks");
          }}
        />
      </label>

      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Real time (s)
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              Real time in seconds of timer running until a flag is set.
            </span>
          </div>
        </span>
        <input
          type="number"
          value={realTime || ""}
          onChange={(e) => {
            setRealTime(Number(e.target.value));
            setActiveField("realTime");
          }}
        />
      </label>

      <label style={{ display: "flex", marginBottom: "10px" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          Expected frequency (Hz)
          <div className="help-tooltip">
            (?)
            <span className="tooltip-text">
              Expected new frequency after changing the counter settings.
            </span>
          </div>
        </span>
        <input
          type="number"
          value={newFrequency || ""}
          onChange={(e) => {
            setNewFrequency(Number(e.target.value));
            setActiveField("newFrequency");
          }}
        />
      </label>

      {/* Footer */}
      <footer className="footer">
        <p>
          Made with ❤️ by <strong>Aron Eggens</strong> |{" "}
          <a
            href="https://github.com/mac-aron"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default TimerCalculator;
