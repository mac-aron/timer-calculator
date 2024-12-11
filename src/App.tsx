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

  // State for the theme
  const [theme, setTheme] = useState<"pcb" | "white">("pcb");

  // State for error messages
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  // Dropdown options
  const resolutionOptions = [8, 16, 32];
  const prescalerOptions = Array.from({ length: 9 }, (_, i) => i);

  // Error message logic
  useEffect(() => {
    if (speed && prescaler >= 0 && resolution) {
      const maxTicks = Math.pow(2, resolution) - 1;
      const prescaledClock = speed / Math.pow(2, prescaler);

      const newErrors: { [key: string]: string } = {};

      // Check for resolution issues
      if (activeField === "totalTicks" && parseInt(totalTicks) > maxTicks) {
        newErrors[
          "totalTicks"
        ] = `Max ticks: ${maxTicks}. Adjust resolution, prescaler, or speed.`;
      }

      if (
        activeField === "realTime" &&
        parseFloat(realTime) > maxTicks / prescaledClock
      ) {
        newErrors["realTime"] = `Time exceeds max for this resolution (${(
          maxTicks / prescaledClock
        ).toFixed(6)} s). Adjust settings.`;
      }

      if (
        activeField === "newFrequency" &&
        parseFloat(newFrequency) < prescaledClock / maxTicks
      ) {
        newErrors["newFrequency"] = `Frequency below limit (${(
          prescaledClock / maxTicks
        ).toFixed(6)} Hz). Adjust settings.`;
      }

      setErrorMessages(newErrors);
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
        setNewFrequency(frequency.toString());
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

  // Add a class to the root div based on the theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "pcb") {
      root.classList.add("pcb-theme");
      root.classList.remove("white-theme");
    } else {
      root.classList.add("white-theme");
      root.classList.remove("pcb-theme");
    }
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "pcb" ? "white" : "pcb"));
  };

  return (
    <div className={theme === "pcb" ? "pcb-theme" : "white-theme"}>
      <div className="timer-calculator">
        <h2>Timer calculator</h2>

        <label style={{ display: "flex", marginBottom: "10px" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            Speed (Hz)
            <div className="help-tooltip">
              (?)
              <span className="tooltip-text">
                The frequency of the MCU's main clock or the timer's clock
                source in Hertz (Hz).
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
                The resolution of the timer’s counter, defined by the number of
                bits used to represent the count. For example, an 8-bit counter
                can count up to 2^8 - 1.
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
                A divider applied to the clock speed to reduce its frequency
                before being used by the timer. For example, a prescaler of 8
                divides the clock speed by 8.
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

        {/* Maximum coounter ticks */}
        <label
          style={{
            display: "flex",
            marginBottom: "10px",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            Maximum counter ticks
            <div className="help-tooltip">
              (?)
              <span className="tooltip-text">
                The total number of ticks the counter can achieve before rolling
                over, determined by the resolution.
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
          {errorMessages["totalTicks"] && (
            <span className="error-message">{errorMessages["totalTicks"]}</span>
          )}
        </label>

        {/* Time period */}
        <label
          style={{
            display: "flex",
            marginBottom: "10px",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            Time period (seconds)
            <div className="help-tooltip">
              (?)
              <span className="tooltip-text">
                The maximum time the timer can run before rolling over.
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
          {errorMessages["realTime"] && (
            <span className="error-message">{errorMessages["realTime"]}</span>
          )}
        </label>

        {/* Resulting frequency */}
        <label
          style={{
            display: "flex",
            marginBottom: "10px",
            flexDirection: "column",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            Resulting frequency (Hz)
            <div className="help-tooltip">
              (?)
              <span className="tooltip-text">
                The frequency of the timer's output signal.
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
          {errorMessages["newFrequency"] && (
            <span className="error-message">
              {errorMessages["newFrequency"]}
            </span>
          )}
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
      <div className="theme-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === "pcb"}
            onChange={toggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default TimerCalculator;
