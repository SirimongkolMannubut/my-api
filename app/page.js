"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", age: "", email: "" });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, age: user.age, email: user.email || "" });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    if (confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (response.ok && result.deletedCount > 0) {
          fetchUsers();
        } else {
          alert("ไม่สามารถลบผู้ใช้ได้");
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">ระบบจัดการผู้ใช้งาน</h1>
        <p className="subtitle">จัดการข้อมูลผู้ใช้อย่างมีประสิทธิภาพ</p>
      </div>

      <div className="stats">
        <h3>📊 สถิติผู้ใช้งาน: {users.length} คน | แสดงผล: {filteredUsers.length} คน</h3>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{editId ? "✏️ แก้ไขข้อมูลผู้ใช้" : "➕ เพิ่มผู้ใช้ใหม่"}</h2>
        </div>
        <div style={{ padding: "24px" }}>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
              className="input"
            />
            <input
              type="number"
              placeholder="อายุ"
              value={form.age}
              onChange={(e) => setForm({...form, age: e.target.value})}
              required
              className="input"
            />
            <input
              type="email"
              placeholder="อีเมล"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="input"
            />
            <button type="submit" className="btn btn-primary">
              {editId ? "💾 บันทึกการแก้ไข" : "➕ เพิ่มผู้ใช้"}
            </button>
            {editId && (
              <button 
                type="button" 
                onClick={() => { setEditId(null); setForm({ name: "", age: "", email: "" }); }} 
                className="btn btn-secondary"
              >
                ❌ ยกเลิก
              </button>
            )}
          </form>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 ค้นหาผู้ใช้งาน..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">👥 รายชื่อผู้ใช้งาน ({filteredUsers.length})</h3>
        </div>
        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{search ? "🔍" : "👤"}</div>
              <p>{search ? "ไม่พบผู้ใช้ที่ค้นหา" : "ยังไม่มีผู้ใช้ในระบบ"}</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <div className="user-details">
                    🎂 อายุ {user.age} ปี {user.email && `📧 ${user.email}`}
                  </div>
                </div>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user)} className="btn btn-success">
                    ✏️ แก้ไข
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="btn btn-danger">
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}