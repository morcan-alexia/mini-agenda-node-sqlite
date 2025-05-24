const form = document.getElementById("contact-form");
const contactList = document.getElementById("contact-list");

const API_URL = "http://localhost:3000/contacts";

// La încărcarea paginii, încarcă toate contactele existente
window.addEventListener("load", loadContacts);

// Trimitere formular (adăugare contact)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  });

  form.reset();
  loadContacts(); // reîncarcă lista
});

// Încarcă și afișează contactele din baza de date
async function loadContacts() {
  const res = await fetch(API_URL);
  const contacts = await res.json();

  contactList.innerHTML = "";

  contacts.forEach((contact) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${contact.name}</strong><br>
        <small>${contact.email}</small><br>
        <small>${contact.phone}</small>
      </div>
      <button class="delete-btn" data-id="${contact.id}">Șterge</button>
    `;

    // Eveniment pentru ștergere
    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await fetch(`${API_URL}/${contact.id}`, { method: "DELETE" });
      loadContacts();
    });

    contactList.appendChild(li);
  });
}
