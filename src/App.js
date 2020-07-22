import React from "react";
import { COUNTRY_CODES } from "./constants";

const fetchTranslation = async (text, langs) => {
  return (
    await (
      await fetch("http://localhost:3001/translate", {
        method: "POST",
        body: JSON.stringify({ text, langs }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json()
  ).translation;
};

const CountryCodes = ({ value, onSelect, filterOut }) => {
  return (
    <select value={value} onSelect={onSelect} onChange={onSelect}>
      {COUNTRY_CODES.map(
        (el) => el[1] !== filterOut && <option value={el[1]}>{el[0]}</option>
      )}
    </select>
  );
};

function App() {
  const text = React.useRef();
  const [translation, setTranslation] = React.useState("");
  const [langs, setLangs] = React.useState({ source: "de", target: "en" });
  const onSubmit = React.useCallback(async () => {
    const response = await fetchTranslation(text.current.value, langs);
    setTranslation(response);
  }, [text.current, langs]);
  return (
    <div className="App" style={{ display: "flex" }}>
      <div style={{ width: "100%", padding: "10px" }}>
        <CountryCodes
          filterOut={langs.target}
          onSelect={(ev) => {
            setLangs({ ...langs, source: ev.target.value });
          }}
          value={langs.source}
        />
        <div>
          <textarea ref={text} style={{ width: "100%" }} />
        </div>
        <button onClick={onSubmit}>Submit</button>
      </div>
      <div style={{ width: "100%", padding: "10px" }}>
        <CountryCodes
          filterOut={langs.source}
          onSelect={(ev) => {
            setLangs({ ...langs, target: ev.target.value });
          }}
          value={langs.target}
        />
        <div>{translation}</div>
      </div>
    </div>
  );
}

export default App;
