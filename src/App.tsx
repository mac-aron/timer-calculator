import React, { useState, useEffect } from "react";

const TimerCalculator: React.FC = () => {
  // State for inputs
  const [speed, setSpeed] = useState<number | undefined>(16000000);
  const [resolution, setResolution] = useState<number>(32);
  const [prescaler, setPrescaler] = useState<number>(3);

  // State for results
  const [totalTicks, setTotalTicks] = useState<string>(""); // Store as string
  const [realTime, setRealTime] = useState<string>(""); // Allow decimals
  const [newFrequency, setNewFrequency] = useState<string>(""); // Allow decimals

  // State to track the active field
  const [activeField, setActiveField] = useState<string | null>(null);

  // Dropdown options
  const resolutionOptions = [8, 16, 32];
  const prescalerOptions = Array.from({ length: 9 }, (_, i) => i);

  // Recalculation logic
  useEffect(() => {
    if (speed && prescaler >= 0 && resolution) {
      if (activeField === "totalTicks" && totalTicks !== "") {
        const time = parseInt(totalTicks) / (speed / Math.pow(2, prescaler));
        const frequency = 1 / time;

        setRealTime(time.toString());
        setNewFrequency(frequency.toString());
      } else if (activeField === "realTime" && realTime !== "") {
        const time = parseFloat(realTime);
        const ticks = time * (speed / Math.pow(2, prescaler));
        const frequency = 1 / time;

        setTotalTicks(Math.round(ticks).toString());
        setNewFrequency(frequency.toString());"Fixed input handling and improved validation"
      } else if (activeField === "newFrequency" && newFrequency !== "") {
        const frequency = parseFloat(newFrequency);
        const time = 1 / frequency;
        const ticks = time * (speed / Math.pow(2, prescaler));

        setRealTime(time.toString());
        setTotalTicks(Math.round(ticks).toString());
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

      {/* Total Counter Ticks */}
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
          type="text"
          value={totalTicks}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setTotalTicks(value);
              setActiveField("totalTicks");
            }
          }}
        />
      </label>

      {/* Real Time */}
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
          type="text"
          value={realTime}
          onChange={(e) => {
            const value = e.target.value;
            if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
              setRealTime(value);
              setActiveField("realTime");
            }
          }}
        />
      </label>

      {/* New Frequency */}
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
          type="text"
          value={newFrequency}
          onChange={(e) => {
            const value = e.target.value;
            if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
              setNewFrequency(value);
              setActiveField("newFrequency");
            }
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