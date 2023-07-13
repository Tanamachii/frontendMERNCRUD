import { useState, useEffect } from "react";
import axios from "axios";
import notesStore from "../stores/notesStore";

function App() {
  const store = notesStore();
  //State
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });
  //Use effect
  useEffect(() => {
    store.fetchNotes();
  }, []);
  // Functions
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

  const updateNote = async (e) => {
    e.preventDefault();
    const { title, body, _id } = updateForm;
    //Send the update request
    const res = await axios.put(`http://localhost:3000/notes/${_id}`, {
      title,
      body,
    });
    //Update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id === _id;
    });
    console.log(res.data.note);
    newNotes[noteIndex] = res.data.notes;
    setNotes(newNotes);

    //Clear form state
    setUpdateForm({ _id: null, title: "", body: "" });
  };

  const toogleUpdate = (note) => {
    //Set state on update form
    setUpdateForm({ title: note.title, body: note.body, _id: note._id });
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  return (
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {store.notes &&
          store.notes.map((note) => {
            return (
              <div key={note._id}>
                <h3> {note.title}</h3>
                <button onClick={() => deleteNote(note._id)}>
                  Delete note
                </button>
                <button
                  onClick={() => {
                    toogleUpdate(note);
                  }}
                >
                  Update note
                </button>
              </div>
            );
          })}
      </div>

      {updateForm._id && (
        <div>
          <h2>Update note</h2>
          <form onSubmit={updateNote}>
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.title}
              name="title"
            />
            <textarea
              onChange={handleUpdateFieldChange}
              value={updateForm.body}
              name="body"
            />
            <button type="submit">Update note</button>
          </form>
        </div>
      )}

      {!updateForm._id && (
        <div>
          <h2>Crete note</h2>
          <form onSubmit={createNote}>
            <input
              onChange={store.updateCreateFormField}
              value={store.createForm.title}
              name="title"
            />
            <textarea
              onChange={store.updateCreateFormField}
              value={store.createForm.body}
              name="body"
            />
            <button type="submit">Create note</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
