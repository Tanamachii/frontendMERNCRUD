import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  //State
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  //Use effect
  useEffect(() => {
    fetchNotes();
  }, []);
  // Functions
  const fetchNotes = async () => {
    //Fetch the notes
    const res = await axios.get("http://localhost:3000/notes");
    //set to state
    console.log(res);
    setNotes(res.data.notes);
    console.log(res);
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    setCreateForm({
      ...createForm,
      [name]: value,
    });
    console.log({ name, value });
  };

  const createNote = async (e) => {
    e.preventDefault();
    //Create the note
    const res = await axios.post("http://localhost:3000/notes", createForm);
    //Update the state
    setNotes([...notes, res.data.note]);
    //Clear state
    setCreateForm({ title: "", body: "" });
    console.log(res);
  };

  const deleteNote = async (_id) => {
    //Delete the note
    await axios.delete(`http://localhost:3000/notes/${_id}`);
    //Update state
    const newNotes = [...notes].filter((notes) => {
      return notes._id !== _id;
    });
    setNotes(newNotes);
  };

  return (
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {notes &&
          notes.map((note) => {
            return (
              <div key={note._id}>
                <h3> {note.title}</h3>
                <button onClick={() => deleteNote(note._id)}>
                  Delete note
                </button>
              </div>
            );
          })}
      </div>

      <div>
        <h2>Crete note</h2>
        <form onSubmit={createNote}>
          <input
            onChange={updateCreateFormField}
            value={createForm.title}
            name="title"
          />
          <textarea
            onChange={updateCreateFormField}
            value={createForm.body}
            name="body"
          />
          <button type="submit">Create note</button>
        </form>
      </div>
    </div>
  );
}

export default App;
