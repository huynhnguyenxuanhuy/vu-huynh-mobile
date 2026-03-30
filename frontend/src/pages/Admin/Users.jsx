import { useEffect, useState } from "react";
import { getAdminUsers } from "../../services/orderService";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAdminUsers();
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi lấy users admin:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="section-space">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="admin-kicker">ADMIN PANEL</p>
            <h2 className="page-title">Quản lý người dùng</h2>
            <p className="section-subtitle">
              Danh sách tài khoản trong hệ thống
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="admin-empty-card">
            <p className="empty">Chưa có người dùng nào.</p>
          </div>
        ) : (
          <div className="list">
            {users.map((user) => (
              <div key={user._id} className="item-box">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#0f172a",
                        marginBottom: 8,
                      }}
                    >
                      {user.name}
                    </h3>

                    <p
                      style={{
                        color: "#475569",
                        marginBottom: 6,
                        wordBreak: "break-word",
                      }}
                    >
                      {user.email}
                    </p>

                    <p style={{ color: "#64748b", fontSize: 14 }}>
                      ID: {user._id}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`status-badge ${
                        user.isAdmin ? "status-confirmed" : "status-pending"
                      }`}
                    >
                      {user.isAdmin ? "admin" : "user"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}