/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.withCredentials = true; // cookie পাঠানোর জন্য

function App() {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [response, setResponse] = useState(null);

  /*
  * // Load CSRF token on app load // user it in the main page
  useEffect(() => {
    axios.get("http://localhost:4000/csrf-token").then((res) => {
      setCsrfToken(res.data.csrfToken);
      // Store into meta tag (for global access)
      const meta = document.createElement("meta");
      meta.name = "csrf-token";
      meta.content = res.data.csrfToken;
      document.head.appendChild(meta);
    });
  }, []);
  */

  useEffect(() => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    if (csrfToken) setCsrfToken(csrfToken);
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

    try {
      const res = await axios.post("http://localhost:4000/submit-form", formData, {
        headers: {
          "X-CSRF-Token": token, // 👈 send csrf token
        },
      });
      setResponse(res.data);
    } catch (err: any) {
      setResponse(err.response?.data);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CSRF Demo Form</h1>
      <form onSubmit={handleSubmit}>
        {/* //* SEND CSRF TOKEN */}
        <input type="hidden" name="X-CSRF-Token" value={csrfToken} />

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <pre style={{ background: "#eee", padding: 10 }}>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
