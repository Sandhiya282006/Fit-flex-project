import React, { useEffect, useState } from "react";

function Exercises({ onLogout, username }) {
  const [exercises, setExercises] = useState({});
  const [progress, setProgress] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/exercises")
      .then((res) => res.json())
      .then((data) => setExercises(data));

    fetch('http://127.0.0.1:5000/progress/${username}')
      .then((res) => res.json())
      .then((data) => setProgress(data));
  }, [username]);

  const saveProgress = async () => {
    if (!selectedExercise || !sets || !reps) {
      alert("Please select exercise and enter sets & reps");
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/progress/${username}', {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise: selectedExercise, sets, reps }),
    });

    const data = await response.json();
    if (data.success) {
      setProgress(data.progress);
      setSets("");
      setReps("");
    }
  };

  return (
    <div className="container">
      <h2>Exercises</h2>
      <button
        onClick={onLogout}
        style={{
          background: "red",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        Logout
      </button>

      {Object.keys(exercises).map((key) => (
        <div className="card" key={key}>
          <h3>{key.toUpperCase()}</h3>
          <iframe
            width="100%"
            height="200"
            src={exercises[key].video}
            title={key}
            allowFullScreen
          ></iframe>
          <ol>
            {exercises[key].steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      ))}

      <hr />
      <h3>Track Workout Progress</h3>
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
      >
        <option value="">-- Select Exercise --</option>
        {Object.keys(exercises).map((key) => (
          <option key={key} value={key}>
            {key.toUpperCase()}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Sets"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <button onClick={saveProgress}>Save Progress</button>

      <h3>Workout History</h3>
      {progress.length === 0 ? (
        <p>No progress yet.</p>
      ) : (
        <ul>
          {progress.map((p, i) => (
            <li key={i}>
              {p.exercise.toUpperCase()} - {p.sets} sets x {p.reps} reps
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Exercises;